import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      database: "taskjournal",
      username: "postgres",
      password: "mysecretpassword",
    }),
  ],
})
export class AppModule {}
