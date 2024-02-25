import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private readonly server: Server;
  private users: any[] = [];

  afterInit(server: any) {
    console.log('socket server is running');
  }
  handleConnection(client: any, ...args: any[]) {
    console.log(client.id, args, 'client arg');
  }
  handleDisconnect(client: any) {
    console.log(client.id, 'disconnect');
  }

  private addUser(userId, socketId) {
    this.users.push({ userId, socketId });
  }

  private removeUser(socketId) {
    const userIndex = this.users.findIndex(
      (user) => user.socketId === socketId,
    );
    if (userIndex != -1) {
      this.users.splice(userIndex, 1);
    }
  }

  private findUserByUserId(userId) {
    const user = this.users.find((user) => user.userId === userId);
    return user;
  }

  @SubscribeMessage('join-user')
  joinUser(client: any, userId: string) {
    this.addUser(userId, client.id);
    this.server.emit('online-users', this.users);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log(client.id, payload);
  }
}
