import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
})
export class ObjectsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;

  afterInit(server: Server) {
    console.log('🔌 Socket.IO initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Emit objectCreated event to all connected clients
   * @param object - The created object
   */
  emitObjectCreated(object: any) {
    this.server.emit('objectCreated', {
      id: object._id,
      title: object.title,
      description: object.description,
      imageUrl: object.imageUrl,
      createdAt: object.createdAt,
    });
  }

  /**
   * Emit objectDeleted event to all connected clients
   * @param objectId - ID of the deleted object
   */
  emitObjectDeleted(objectId: string) {
    this.server.emit('objectDeleted', {
      id: objectId,
      deletedAt: new Date(),
    });
  }
}
