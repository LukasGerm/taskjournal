import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  ForbiddenException,
} from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto, UpdateChannelDto } from "./channel.dto";
import { AuthGuard } from "../auth/auth.guard";
import { ChannelType } from "shared/src/types/channels.types";

@Controller("channels")
@UseGuards(AuthGuard)
export class ChannelsController {
  private readonly logger = new Logger(ChannelsController.name);

  constructor(private readonly channelsService: ChannelsService) {}

  @Get(":id")
  async getChannel(@Param("id") id: string) {
    this.logger.log(`Getting channel with id ${id}`);
    const channel: ChannelType = await this.channelsService.getChannel(id);
    return channel;
  }

  @Get()
  async getChannels() {
    const channels: ChannelType[] = await this.channelsService.getChannels();
    return channels;
  }

  @Post()
  async createChannel(
    @Body() createChannelDto: CreateChannelDto,
    @Request() req,
  ) {
    try {
      createChannelDto.ownerId = req.user.id;
      return await this.channelsService.createChannel(createChannelDto);
    } catch (error) {
      this.logger.error("Channel creation failed", error);
      throw new InternalServerErrorException("Channel creation failed");
    }
  }

  @Delete(":id")
  async deleteChannel(@Param("id") id: string, @Request() req) {
    try {
      const channel = await this.channelsService.getChannel(id);
      if (!channel) {
        throw new Error("Channel not found");
      }

      if (channel.ownerId !== req.user.id) {
        throw new ForbiddenException(
          "Only channel owner can delete the channel",
        );
      }

      await this.channelsService.deleteChannel(id);
    } catch (error) {
      this.logger.error("Channel deletion failed", error);
      throw new InternalServerErrorException("Channel deletion failed");
    }
  }

  @Patch(":id")
  async updateChannel(
    @Param("id") id: string,
    @Body() updateChannelDto: UpdateChannelDto,
    @Request() req,
  ) {
    try {
      const channel = await this.channelsService.getChannel(id);
      if (!channel) {
        throw new Error("Channel not found");
      }

      if (channel.ownerId !== req.user.id) {
        throw new ForbiddenException(
          "Only channel owner can update the channel",
        );
      }

      return await this.channelsService.updateChannel(id, updateChannelDto);
    } catch (error) {
      this.logger.error("Channel update failed", error);
      throw new InternalServerErrorException("Channel update failed");
    }
  }

  @Post(":id/members")
  async addMember(
    @Param("id") channelId: string,
    @Body("userId") userId: string,
    @Request() req,
  ) {
    try {
      const channel = await this.channelsService.getChannel(channelId);
      if (!channel) {
        throw new Error("Channel not found");
      }

      if (channel.isPrivate && channel.ownerId !== req.user.id) {
        throw new ForbiddenException(
          "Only channel owner can add members to private channels",
        );
      }

      return await this.channelsService.addMember(channelId, userId);
    } catch (error) {
      this.logger.error("Adding member failed", error);
      throw new InternalServerErrorException("Adding member failed");
    }
  }

  @Delete(":id/members/:userId")
  async removeMember(
    @Param("id") channelId: string,
    @Param("userId") userId: string,
    @Request() req,
  ) {
    try {
      const channel = await this.channelsService.getChannel(channelId);
      if (!channel) {
        throw new Error("Channel not found");
      }

      if (channel.ownerId !== req.user.id && req.user.id !== userId) {
        throw new ForbiddenException(
          "Only channel owner or the member themselves can remove members",
        );
      }

      return await this.channelsService.removeMember(channelId, userId);
    } catch (error) {
      this.logger.error("Removing member failed", error);
      throw new InternalServerErrorException("Removing member failed");
    }
  }

  @Get(":id/members")
  async getChannelMembers(@Param("id") channelId: string) {
    return this.channelsService.getChannelMembers(channelId);
  }
}
