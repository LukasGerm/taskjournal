import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { AuthGuard } from "../auth/auth.guard";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/PrismaService";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthGuard,
        AuthService,
        JwtService,
        UsersService,
        PrismaService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
