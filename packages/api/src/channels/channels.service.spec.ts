import { Test, TestingModule } from "@nestjs/testing";
import { ChannelsService } from "./channels.service";
import { AuthGuard } from "../auth/auth.guard";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../prisma/PrismaService";

describe("ChannelsService", () => {
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        AuthGuard,
        AuthService,
        JwtService,
        UsersService,
        PrismaService,
      ],
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
