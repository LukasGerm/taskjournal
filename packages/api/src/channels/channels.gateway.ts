import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

interface ActiveChannelConnection {
  users: string[];
}

interface VoiceConnectionOffer {
  offer: RTCSessionDescriptionInit;
  to: string;
}

interface VoiceConnectionAnswer {
  answer: RTCSessionDescriptionInit;
  to: string;
}

interface IceCandidate {
  candidate: RTCIceCandidateInit;
  to: string;
}

const origin =
  process.env.NODE_ENV === "production" ? "https://example.com" : "*";

@WebSocketGateway({
  cors: {
    origin,
  },
})
export class ChannelsGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer()
  server: Server;

  private channelUsers = new Map<string, Set<string>>();

  private removeUserIdFromAllChannels(socket: Socket) {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
  }

  private getConnections(): Record<string, ActiveChannelConnection> {
    const connections: Record<string, ActiveChannelConnection> = {};

    this.server.sockets.adapter.rooms.forEach((value, key) => {
      connections[key] = {
        users: Array.from(value),
      };
    });

    return connections;
  }

  private leaveCurrentChannel(socket: Socket) {
    for (const [channel, users] of this.channelUsers.entries()) {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        if (users.size === 0) {
          this.channelUsers.delete(channel);
        }
        // Notify others in the channel that this user left
        this.server.to(channel).emit("userLeft", socket.id);
        socket.leave(channel);
      }
    }
  }

  @SubscribeMessage("joinChannel")
  handleJoinChannel(
    @MessageBody()
    data: {
      channel: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    const { channel } = data;
    Logger.log(`User ${socket.id} joining channel ${channel}`);

    // Remove from previous channels
    this.leaveCurrentChannel(socket);

    // Join new channel
    socket.join(channel);

    // Initialize channel users set if it doesn't exist
    if (!this.channelUsers.has(channel)) {
      this.channelUsers.set(channel, new Set());
    }

    const users = this.channelUsers.get(channel)!;

    // Add new user to channel
    users.add(socket.id);

    // Notify existing users about the new peer
    this.server.to(channel).emit("userJoined", socket.id);

    // Send existing users to the new peer (excluding self)
    const existingUsers = Array.from(users).filter((id) => id !== socket.id);
    socket.emit("existingUsers", existingUsers);

    this.server.emit("activeChannelConnections", this.getConnections());
  }

  @SubscribeMessage("offerVoiceConnection")
  handleOfferVoiceConnection(
    @MessageBody()
    data: VoiceConnectionOffer,
    @ConnectedSocket() socket: Socket,
  ) {
    Logger.log(`User ${socket.id} sent offer to ${data.to}`);

    this.server.to(data.to).emit("offerVoiceConnection", {
      offer: data.offer,
      from: socket.id,
    });
  }

  @SubscribeMessage("answerVoiceConnection")
  handleAnswerVoiceConnection(
    @MessageBody()
    data: VoiceConnectionAnswer,
    @ConnectedSocket() socket: Socket,
  ) {
    Logger.log(`User ${socket.id} sent answer to ${data.to}`);

    this.server.to(data.to).emit("answerVoiceConnection", {
      answer: data.answer,
      from: socket.id,
    });
  }

  @SubscribeMessage("newIceCandidate")
  handleNewIceCandidate(
    @MessageBody()
    data: IceCandidate,
    @ConnectedSocket() socket: Socket,
  ) {
    Logger.log(`User ${socket.id} sent ICE candidate to ${data.to}`);

    this.server.to(data.to).emit("newIceCandidate", {
      candidate: data.candidate,
      from: socket.id,
    });
  }

  @SubscribeMessage("disconnectFromChannel")
  handleDisconnectFromChannel(@ConnectedSocket() socket: Socket): boolean {
    this.leaveCurrentChannel(socket);

    this.server.emit("activeChannelConnections", this.getConnections());
    return true;
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.leaveCurrentChannel(socket);
    this.server.emit("activeChannelConnections", this.getConnections());
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    socket.emit("activeChannelConnections", this.getConnections());
  }
}
