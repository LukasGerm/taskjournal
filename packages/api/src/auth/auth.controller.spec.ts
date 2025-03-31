import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/PrismaService";
import { UsersService } from "../users/users.service";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  const mockAuthService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
    refreshAccessToken: jest.fn(),
    logout: jest.fn(),
    revokeAllRefreshTokens: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const mockUsersService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
  };

  const mockUser = {
    sub: "123",
    username: "testuser",
    id: "123",
    email: "test@example.com",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        AuthGuard,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Public Endpoints", () => {
    describe("signIn", () => {
      const signInDto = {
        username: "testuser",
        password: "password123",
      };

      it("should set cookies with tokens", async () => {
        const expectedResponse = {
          access_token: "access-token",
          refresh_token: "refresh-token",
        };

        mockAuthService.signIn.mockResolvedValueOnce(expectedResponse);

        // @ts-expect-error test

        await controller.signIn(signInDto, mockResponse);

        expect(authService.signIn).toHaveBeenCalledWith(
          signInDto.username,
          signInDto.password,
        );
        expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
        expect(mockResponse.cookie).toHaveBeenCalledWith(
          "access_token",
          expectedResponse.access_token,
          expect.objectContaining({
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
          }),
        );
        expect(mockResponse.cookie).toHaveBeenCalledWith(
          "refresh_token",
          expectedResponse.refresh_token,
          expect.objectContaining({
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          }),
        );
      });
    });

    describe("signUp", () => {
      const signUpDto = {
        username: "newuser",
        password: "password123",
        email: "test@example.com",
      };

      it("should register user and set cookies", async () => {
        const expectedResponse = {
          access_token: "access-token",
          refresh_token: "refresh-token",
        };

        mockAuthService.signUp.mockResolvedValueOnce(expectedResponse);

        // @ts-expect-error test
        await controller.signUp(signUpDto, mockResponse);

        expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
        expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Protected Endpoints", () => {
    const mockUser = { sub: "123", username: "testuser" };

    describe("getProfile", () => {
      it("should return user profile", async () => {
        const mockRequest = { user: mockUser };
        const result = await controller.getProfile(mockRequest);

        expect(result).toEqual({
          id: mockUser.sub,
          username: mockUser.username,
        });
      });
    });

    describe("logoutAll", () => {
      it("should revoke all refresh tokens", async () => {
        const mockRequest = { user: mockUser };
        await controller.logoutAll(mockRequest);

        expect(authService.revokeAllRefreshTokens).toHaveBeenCalledWith(
          mockUser.sub,
        );
      });
    });
  });

  describe("AuthGuard", () => {
    let guard: AuthGuard;

    beforeEach(() => {
      guard = new AuthGuard(jwtService, authService);
    });

    it("should throw UnauthorizedException when no tokens provided", async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({ cookies: {} }),
          getResponse: () => mockResponse,
        }),
      };

      await expect(guard.canActivate(mockContext as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should validate access token and return true", async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            cookies: {
              access_token: "valid-access-token",
              refresh_token: "valid-refresh-token",
            },
          }),
          getResponse: () => mockResponse,
        }),
      };

      mockJwtService.verifyAsync.mockResolvedValueOnce(mockUser);

      const result = await guard.canActivate(mockContext as any);
      expect(result).toBe(true);
    });

    it("should refresh token when access token is invalid", async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            cookies: {
              access_token: "invalid-access-token",
              refresh_token: "valid-refresh-token",
            },
          }),
          getResponse: () => mockResponse,
        }),
      };

      mockJwtService.verifyAsync
        .mockRejectedValueOnce(new Error("Invalid token"))
        .mockResolvedValueOnce(mockUser);

      mockAuthService.refreshAccessToken.mockResolvedValueOnce({
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
      });

      const result = await guard.canActivate(mockContext as any);
      expect(result).toBe(true);
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    });
  });
});
