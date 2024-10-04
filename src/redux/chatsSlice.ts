import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IUser } from '@/types/user.types';

import { sortChatsFn } from '@/utils/sortChats';

import { TSmthType } from '@/socketService';

interface IInitialState {
  allChats: any;
}

const initialState: IInitialState = {
  allChats: null
};

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<any>) {
      state.allChats = action.payload;
    },
    setNotifications(
      state,
      action: PayloadAction<{ type: TSmthType; smthId: number; count: number }>
    ) {
      const chatIndex = state.allChats.findIndex(
        (i: any) =>
          i.type === action.payload.type && i.id === action.payload.smthId
      );
      if (chatIndex !== -1) {
        state.allChats[chatIndex].count = action.payload.count;
      }
    },
    updateNotifications(
      state,
      action: PayloadAction<{
        smthId: number;
        type: TSmthType;
        incrementOrDecrement: 'increment' | 'decrement';
      }>
    ) {
      const chatToUpdate = state.allChats.find(
        (i: any) =>
          i.type === action.payload.type && i.id === action.payload.smthId
      );
      if (chatToUpdate) {
        action.payload.incrementOrDecrement === 'increment'
          ? (chatToUpdate.count += 1)
          : (chatToUpdate.count -= 1);
        state.allChats = state.allChats;
      }
    },
    updateChat(
      state,
      action: PayloadAction<{ smthId: number; type: TSmthType; newData: any }>
    ) {
      const chatToUpdate = state.allChats.find(
        (i: any) =>
          i.type === action.payload.type && i.id === action.payload.smthId
      );

      if (chatToUpdate) {
        chatToUpdate.messages.unshift(action.payload.newData);
        state.allChats = sortChatsFn(state.allChats);
      }
    },
    deleteMessage(
      state,
      action: PayloadAction<{
        type: TSmthType;
        smthId: number;
        messageId: number;
      }>
    ) {
      const chatIndex = state.allChats.findIndex(
        (i: any) =>
          i.type === action.payload.type && i.id === action.payload.smthId
      );

      if (chatIndex !== -1) {
        const messageIndex = state.allChats[chatIndex].messages.findIndex(
          (message: any) => message.id === action.payload.messageId
        );

        if (messageIndex !== -1) {
          state.allChats[chatIndex].messages.splice(messageIndex, 1);
          state.allChats = sortChatsFn(state.allChats);
        }
      }
    },
    readMessage(
      state,
      action: PayloadAction<{
        type: TSmthType;
        smthId: number;
        messageId: number;
      }>
    ) {
      const chatIndex = state.allChats.findIndex(
        (i: any) =>
          i.type === action.payload.type && i.id === action.payload.smthId
      );

      if (chatIndex !== -1) {
        const messageIndex = state.allChats[chatIndex].messages.findIndex(
          (message: any) => message.id === action.payload.messageId
        );

        if (messageIndex !== -1) {
          state.allChats[chatIndex].messages[messageIndex].isRead = true;
          state.allChats = state.allChats;
        }
      }
    },
    editMessage(
      state,
      action: PayloadAction<{
        type: TSmthType;
        smthId: number;
        messageId: number;
        newMessageContent: string;
      }>
    ) {
      const chatIndex = state.allChats.findIndex(
        (i: any) =>
          i.type === action.payload.type && i.id === action.payload.smthId
      );

      if (chatIndex !== -1) {
        const messageIndex = state.allChats[chatIndex].messages.findIndex(
          (message: any) => message.id === action.payload.messageId
        );

        if (messageIndex !== -1) {
          state.allChats[chatIndex].messages[messageIndex].content =
            action.payload.newMessageContent;
          state.allChats[chatIndex].messages[messageIndex].isEdit = true;
          state.allChats = state.allChats;
        }
      }
    },
    setUserFromChat(
      state,
      action: PayloadAction<{
        chatId: number;
        data: {
          name: string;
          avatar: string;
          isOnline: boolean;
          id: number;
        };
      }>
    ) {
      const chatToUpdate = state.allChats.find(
        (i: any) => i.type === 'chat' && i.id === action.payload.chatId
      );
      if (chatToUpdate) {
        chatToUpdate.userData = {
          name: action.payload.data.name,
          avatar: action.payload.data.avatar,
          isOnline: action.payload.data.isOnline,
          id: action.payload.data.id
        };
      }
    },
    changeUserFromChatOnline(
      state,
      action: PayloadAction<{ userId: number; event: 'online' | 'offline' }>
    ) {
      state.allChats.find((i: any) => {
        if (i.type === 'chat' && i.userData.id === action.payload.userId) {
          i.userData.isOnline =
            action.payload.event === 'offline' ? false : true;
        }
      });
      state.allChats = state.allChats;
    },
    addMessages(
      state,
      action: PayloadAction<{
        type: TSmthType;
        smthId: number;
        newMessages: any[];
      }>
    ) {
      const chatToUpdate = state.allChats.find(
        (i: any) =>
          i.type === action.payload.type && i.id === action.payload.smthId
      );
      if (chatToUpdate) {
        chatToUpdate.messages = [
          ...chatToUpdate.messages,
          ...action.payload.newMessages
        ];
      }
    }
  }
});

export const {
  setChats,
  updateChat,
  deleteMessage,
  readMessage,
  editMessage,
  setNotifications,
  updateNotifications,
  setUserFromChat,
  changeUserFromChatOnline,
  addMessages
} = chatSlice.actions;

export default chatSlice.reducer;
