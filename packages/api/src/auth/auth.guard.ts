import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = this.extractTokensFromCookie(request);

    if (!token.accessToken && !token.refreshToken) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      // First try to verify the access token
      request["user"] = await this.jwtService.verifyAsync(token.accessToken, {
        secret: process.env.JWT_SECRET || "your-secret-key",
      });
      return true;
    } catch (accessTokenError) {
      // If access token is invalid, try to refresh using refresh token
      try {
        const tokens = await this.authService.refreshAccessToken(
          token.refreshToken,
        );

        // Set new tokens in cookies
        response.cookie("access_token", tokens.access_token);
        response.cookie("refresh_token", tokens.refresh_token);

        // Set the user payload from the new access token
        request["user"] = await this.jwtService.verifyAsync(
          tokens.access_token,
          {
            secret: process.env.JWT_SECRET || "your-secret-key",
          },
        );

        return true;
      } catch (refreshTokenError) {
        throw new UnauthorizedException("Invalid refresh token");
      }
    }
  }

  private extractTokensFromCookie(request: Request): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = request.cookies?.["access_token"];
    const refreshToken = request.cookies?.["refresh_token"];

    return {
      accessToken,
      refreshToken,
    };
  }
}
