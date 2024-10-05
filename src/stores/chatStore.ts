import { ObservableMap, makeAutoObservable } from 'mobx';

import { sortChatsFn } from '@/utils/sortChats';

import { TSmthType } from '@/socketService';

class ChatStore {
  allChats: ObservableMap<string, any> = new ObservableMap();

  constructor() {
    makeAutoObservable(this);
  }

  getChatById(id: string) {
    // id with format "chat12"
    return this.allChats.get(id);
  }

  setChats(payload: any) {
    this.allChats.replace(payload);
  }

  setNotifications(payload: {
    type: TSmthType;
    smthId: number;
    count: number;
  }) {
    let chat = this.getChatById(`${payload.type}${payload.smthId}`);
    if (chat) {
      this.allChats.set(`${payload.type}${payload.smthId}`, {
        ...chat,
        count: payload.count
      });
    }
  }

  updateNotifications(payload: {
    smthId: number;
    type: TSmthType;
    incrementOrDecrement: 'increment' | 'decrement';
  }) {
    const chat = this.getChatById(`${payload.type}${payload.smthId}`);

    if (chat) {
      if (payload.incrementOrDecrement === 'increment') {
        this.allChats.set(`${payload.type}${payload.smthId}`, {
          ...chat,
          count: chat.count + 1
        });
      } else {
        this.allChats.set(`${payload.type}${payload.smthId}`, {
          ...chat,
          count: Math.max(0, chat.count - 1)
        });
      }
    }
  }

  updateChat(payload: { smthId: number; type: TSmthType; newData: any }) {
    const chat = this.getChatById(`${payload.type}${payload.smthId}`);
    if (chat) {
      chat.messages.replace([payload.newData, ...chat.messages]);
      // this.allChats = sortChatsFn(this.allChats);
    }
  }

  deleteMessage(payload: {
    type: TSmthType;
    smthId: number;
    messageId: number;
  }) {
    const chat = this.getChatById(`${payload.type}${payload.smthId}`);
    if (chat) {
      const messages = chat.messages.filter(
        (message: any) => message.id !== payload.messageId
      );
      this.allChats.set(`${payload.type}${payload.smthId}`, {
        ...chat,
        messages
      });
      // this.allChats = sortChatsFn(this.allChats);
    }
  }

  readMessage(payload: { type: TSmthType; smthId: number; messageId: number }) {
    const chatId = `${payload.type}${payload.smthId}`;
    const chat = this.getChatById(chatId);

    if (chat) {
      const messageIndex = chat.messages.findIndex(
        (message: any) => message.id === payload.messageId
      );

      if (messageIndex !== -1) {
        chat.messages[messageIndex].isRead = true;
        this.allChats.set(chatId, { ...chat });
      }
    }
  }

  editMessage(payload: {
    type: TSmthType;
    smthId: number;
    messageId: number;
    newMessageContent: string;
  }) {
    const chatId = `${payload.type}${payload.smthId}`;
    const chat = this.getChatById(chatId);

    if (chat) {
      const messageIndex = chat.messages.findIndex(
        (message: any) => message.id === payload.messageId
      );

      if (messageIndex !== -1) {
        chat.messages[messageIndex].content = payload.newMessageContent;
        chat.messages[messageIndex].isEdit = true;
        this.allChats.set(chatId, { ...chat });
      }
    }
  }

  setUserFromChat(payload: {
    chatId: number;
    data: {
      name: string;
      avatar: string;
      isOnline: boolean;
      id: number;
    };
  }) {
    const chatId = `chat${payload.chatId}`;
    const chat = this.getChatById(chatId);
    if (chat) {
      chat.userData = {
        name: payload.data.name,
        avatar: payload.data.avatar,
        isOnline: payload.data.isOnline,
        id: payload.data.id
      };
      this.allChats.set(chatId, { ...chat });
    }
  }

  changeUserFromChatOnline(payload: {
    event: 'online' | 'offline';
    userId: number;
  }) {
    const chatEntry = Array.from(this.allChats.entries()).find(([key, chat]: [string, any]) => {
      return chat.type === 'chat' && chat.userData?.id === payload.userId;
    });
  
    if (chatEntry) {
      const [key, chat] = chatEntry;
      chat.userData.isOnline = payload.event === 'offline' ? false : true;
      this.allChats.set(key, { ...chat });
    }
  }
  

  addMessages(payload: {
    type: TSmthType;
    smthId: number;
    newMessages: any[];
  }) {
    const chatId = `${payload.type}${payload.smthId}`;
    const chat = this.getChatById(chatId);
    if (chat) {
      const updatedMessages = [...chat.messages, ...payload.newMessages];
      this.allChats.set(chatId, { ...chat, messages: updatedMessages });
    }
  }
}

const chatStore = new ChatStore();
export default chatStore;
