import { Module } from "@nestjs/common";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { PrismaService } from "src/prisma/PrismaService";
import { ChannelsGateway } from "./channels.gateway";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";

@Module({
  controllers: [ChannelsController],
  providers: [
    ChannelsService,
    PrismaService,
    ChannelsGateway,
    JwtService,
    AuthService,
    UsersService,
  ],
})
export class ChannelsModule {}
