import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "15m" },
    }),
  ],
  providers: [AuthService, UsersService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
