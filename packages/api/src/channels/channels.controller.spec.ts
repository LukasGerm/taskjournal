import { Test, TestingModule } from "@nestjs/testing";
import { ChannelsController } from "./channels.controller";
import { AuthGuard } from "../auth/auth.guard";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../prisma/PrismaService";
import { ChannelsService } from "./channels.service";

describe("ChannelsController", () => {
  let controller: ChannelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [
        AuthGuard,
        AuthService,
        JwtService,
        UsersService,
        PrismaService,
        ChannelsService,
      ],
    }).compile();

    controller = module.get<ChannelsController>(ChannelsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
