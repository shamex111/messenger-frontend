import { Socket, io } from 'socket.io-client';

import { SERVER_URL_BASE } from './config/api.config';

export type TSmthType = 'channel' | 'group' | 'chat';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SERVER_URL_BASE, { withCredentials: true });
      this.socket.on('connect', () => console.log('конект сокета'));
      this.socket.on('disconnect', () => console.log('дисконект сокета'));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    if (!this.socket) {
      return console.log('Сокет отсутствует!');
    }
    return this.socket;
  }

  joinPersonalRoom(userId: number) {
    if (this.socket) {
      this.socket.emit('joinPersonalRoom', userId);
      console.log(`Joined room: user_${userId}`);
    }
  }

  leavePersonalRoom(userId: number) {
    if (this.socket) {
      this.socket.emit('leavePersonalRoom', userId);
      console.log(`Left room: user_${userId}`);
    }
  }

  joinRoom(type: string, smthId: number) {
    if (this.socket) {
      this.socket.emit('join-room', type, smthId);
    }
  }

  leaveRoom(type: string, smthId: number) {
    if (this.socket) {
      this.socket.emit('leave-room', type, smthId);
    }
  }

  // subscribeToStatus(targetUserIds: number[]) {
  //   if (this.socket) {
  //     console.log('subscribe', targetUserIds[0])
  //     this.socket.emit('subscribeToStatus', { targetUserIds });
  //   }
  // }

  // unsubscribeFromStatus(targetUserIds: number[]) {
  //   if (this.socket) {
  //     this.socket.emit('unsubscribeFromStatus', { targetUserIds });
  //   }
  // }

  onChatUpdated(
    callback: (data: {
      event:
        | 'message'
        | 'message-delete'
        | 'message-status'
        | 'notification'
        | 'online';
      messageId?: number;
      userId?: number;
    }) => void
  ) {
    if (this.socket) {
      this.socket.on('chat-updated', data => {
        callback(data);
      });
    }
  }

  offChatUpdated(callback: () => void) {
    if (this.socket) {
      this.socket.off('chat-updated', callback);
    }
  }
  onUserChats(
    callback: (data: {
      event: 'delete' | 'add';
      type: TSmthType;
      smthId: number;
    }) => void
  ) {
    if (this.socket) {
      this.socket.on('user-chats', data => {
        callback(data);
      });
    }
  }

  offUserChats(callback: () => void) {
    if (this.socket) {
      this.socket.off('user-chats', callback);
    }
  }
}

const socketService = SocketService.getInstance();
export default socketService;
