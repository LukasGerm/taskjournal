import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../prisma/PrismaService";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { SignUpDto } from "./auth.dto";
import { TokenPayload } from "shared/src/types/auth.types";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
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
    userId: string,
    username: string,
    email: string,
  ) {
    const payload: TokenPayload = { sub: userId, username, email };

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

  private async saveRefreshToken(userId: string, token: string) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days from now

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expires,
      },
    });
  }

  async refreshAccessToken(refreshToken: string) {
    const savedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
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
    await this.prisma.refreshToken.update({
      where: { id: savedToken.id },
      data: { isRevoked: true },
    });

    // Save the new refresh token
    await this.saveRefreshToken(savedToken.user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: {
        token: refreshToken,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });
  }

  async revokeAllRefreshTokens(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });
  }
}
