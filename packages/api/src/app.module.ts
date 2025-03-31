import { Module } from "@nestjs/common";

import { ChannelsModule } from "./channels/channels.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [ChannelsModule, AuthModule, UsersModule],
})
export class AppModule {}
