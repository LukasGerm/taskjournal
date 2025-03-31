import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/PrismaService";
import { Prisma } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string) {
    return this.prisma.user.findFirst({ where: { username } });
  }

  async create(data: {
    username: string;
    email: string;
    passwordHash: string;
  }) {
    try {
      return await this.prisma.user.create({
        data,
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException("Username or email is already taken");
        }
      }
      throw error;
    }
  }
}
