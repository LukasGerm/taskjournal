import { Injectable } from "@nestjs/common";
import { CreateChannelDto, UpdateChannelDto } from "./channel.dto";
import { PrismaService } from "../prisma/PrismaService";

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async createChannel(data: CreateChannelDto) {
    return this.prisma.channel.create({
      data,
      include: {
        owner: true,
        members: true,
      },
    });
  }

  async getChannel(id: string) {
    return this.prisma.channel.findUnique({
      where: { id },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        messages: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  async getChannels() {
    return this.prisma.channel.findMany();
  }

  async deleteChannel(id: string): Promise<void> {
    await this.prisma.channel.delete({
      where: { id },
    });
  }

  async addMember(channelId: string, userId: string) {
    return this.prisma.channelMember.create({
      data: {
        channelId,
        userId,
      },
      include: {
        user: true,
        channel: true,
      },
    });
  }

  async removeMember(channelId: string, userId: string) {
    return this.prisma.channelMember.delete({
      where: {
        userId_channelId: {
          userId,
          channelId,
        },
      },
    });
  }

  async updateChannel(id: string, data: UpdateChannelDto) {
    return this.prisma.channel.update({
      where: { id },
      data,
      include: {
        owner: true,
        members: true,
      },
    });
  }

  async getChannelMembers(channelId: string) {
    return this.prisma.channelMember.findMany({
      where: {
        channelId,
      },
      include: {
        user: true,
      },
    });
  }
}
