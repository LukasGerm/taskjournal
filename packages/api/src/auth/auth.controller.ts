import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Response,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { SignInDto } from "./auth.dto";
import { Response as ExpressResponse } from "express";
import { AuthProfile } from "shared/src/types/auth.types";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  private setCookies(
    response: ExpressResponse,
    accessToken: string,
    refreshToken: string,
  ) {
    // Set access token cookie
    response.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refresh token cookie
    response.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(
    @Body() signInDto: SignInDto,
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    const result = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    this.setCookies(response, result.access_token, result.refresh_token);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() refreshTokenDto: { refresh_token: string }) {
    return this.authService.refreshAccessToken(refreshTokenDto.refresh_token);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Body() refreshTokenDto: { refresh_token: string }) {
    return this.authService.logout(refreshTokenDto.refresh_token);
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req: any) {
    const profile: AuthProfile = {
      id: req.user.sub,
      username: req.user.username,
      email: req.user.email,
    };
    // The user object is attached by the AuthGuard
    return profile;
  }

  @UseGuards(AuthGuard)
  @Post("logout-all")
  @HttpCode(HttpStatus.OK)
  logoutAll(@Request() req: any) {
    return this.authService.revokeAllRefreshTokens(req.user.sub);
  }
}
