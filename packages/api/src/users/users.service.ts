import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(data: {
    username: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      const user = this.usersRepository.create({
        ...data,
        firstName: "", // Setting default values for required fields
        lastName: "",
        isActive: true,
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      // Handle unique constraint violations
      if (error.code === "23505") {
        // PostgreSQL unique violation code
        throw new ConflictException("Username or email already exists");
      }
      throw error;
    }
  }
}
