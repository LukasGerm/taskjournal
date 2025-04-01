import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { SignUpDto } from "./auth.dto";
import { TokenPayload } from "../generated";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.generateTokens(
      user.id,
      user.username,
      user.email,
    );
    await this.saveRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async signUp(
    data: SignUpDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { username, password, email } = data;

    const existingUser = await this.usersService.findOne(username);

    if (existingUser) {
      throw new UnauthorizedException("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      username,
      email,
      passwordHash: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const tokens = await this.generateTokens(
      user.id,
      user.username,
      user.email,
    );
    await this.saveRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  private async generateTokens(
    userId: number,
    username: string,
    email: string,
  ) {
    const payload: TokenPayload = { sub: userId.toString(), username, email };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: "15m" }),
      this.generateRefreshToken(),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private generateRefreshToken(): string {
    return randomBytes(40).toString("hex");
  }

  private async saveRefreshToken(userId: number, token: string) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days from now

    const refreshToken = this.refreshTokenRepository.create({
      token,
      userId,
      expires,
    });

    await this.refreshTokenRepository.save(refreshToken);
  }

  async refreshAccessToken(refreshToken: string) {
    const savedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ["user"],
    });

    if (
      !savedToken ||
      savedToken.isRevoked ||
      savedToken.expires < new Date()
    ) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const tokens = await this.generateTokens(
      savedToken.user.id,
      savedToken.user.username,
      savedToken.user.email,
    );

    // Revoke the old refresh token
    await this.refreshTokenRepository.update(savedToken.id, {
      isRevoked: true,
    });

    // Save the new refresh token
    await this.saveRefreshToken(savedToken.user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(refreshToken: string) {
    await this.refreshTokenRepository.update(
      { token: refreshToken, isRevoked: false },
      { isRevoked: true },
    );
  }

  async revokeAllRefreshTokens(userId: number) {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }
}
