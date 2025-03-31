import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { PrismaService } from "../prisma/PrismaService";
import { UsersService } from "../users/users.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "15m" },
    }),
  ],
  providers: [AuthService, PrismaService, UsersService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
