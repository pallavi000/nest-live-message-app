import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ISocketUser } from 'src/@types/user';
import { userDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server;

  private users: ISocketUser[] = [];

  afterInit(server: any) {
    this.server = server;
    console.log('socket server is runninggg');
  }
  handleConnection(client: any, ...args: any[]) {
    console.log(client.id, args, 'client arg');
  }
  handleDisconnect(client: any) {
    this.removeUser(client.id);
    console.log(client.id, 'disconnect');
  }

  private addUser(user: User, socketId: string) {
    const existenceUser = this.findUserByUserId(user.id);
    if (!existenceUser) {
      this.users.push({ ...user, socketId });
    } else {
      const userIndex = this.users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...user, socketId };
      }
    }
  }

  private removeUser(socketId: string) {
    const userIndex = this.users.findIndex(
      (user) => user.socketId === socketId,
    );
    if (userIndex != -1) {
      this.users.splice(userIndex, 1);
    }
  }

  private findUserByUserId(userId: number) {
    const user = this.users.find((user) => user.id === userId);
    return user;
  }

  @SubscribeMessage('join-user')
  joinUser(client: any, user: User) {
    this.addUser(user, client.id);
    this.server.emit('online-users', this.users);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    const user = this.findUserByUserId(payload.userId);
    if (user) {
      console.log(user, 'receiverrrrrrrrrrrr');
      client.to(user.socketId).emit('new-message', payload.message);
    }
  }
}
