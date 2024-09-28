'use client';

import { FC, PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '@/components/ui/main-layout/MainLayout';
import { useChatsData } from '@/components/ui/main-layout/sidebar/search-side-bar/chats/useChatsItemQuery';

import userService from '@/services/user.service';

import {
  deleteMessage,
  editMessage,
  readMessage,
  updateChat,
  updateNotifications
} from '@/redux/chatsSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { saveProfile } from '@/redux/userSlice';
import socketService, { TSmthType } from '@/socketService';

const Layout: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const chats = useSelector((state: RootState) => state.chats.allChats);

  useEffect(() => {
    socketService.connect();

    const handleChatUpdate = (data: {
      event:
        | 'message'
        | 'message-delete'
        | 'message-status'
        | 'notification'
        | 'message-edit';
      messageId?: number;
      userId?: number;
      newContent?: string;
      newMessageData?: any;
      smthId: number;
      type: TSmthType;
      incrementOrDecrement?: 'increment' | 'decrement';
    }) => {
      switch (data.event) {
        case 'message':
          dispatch(
            updateChat({
              smthId: data.smthId,
              type: data.type,
              newData: data.newMessageData
            })
          );
          break;
        case 'message-delete':
          dispatch(
            deleteMessage({
              smthId: data.smthId,
              type: data.type,
              messageId: data.messageId as number
            })
          );
          break;
        case 'message-status':
          dispatch(
            readMessage({
              smthId: data.smthId,
              type: data.type,
              messageId: data.messageId as number
            })
          );
          break;
        case 'message-edit':
          dispatch(
            editMessage({
              smthId: data.smthId,
              type: data.type,
              messageId: data.messageId as number,
              newMessageContent: data.newContent as string
            })
          );
          break;
        case 'notification':
          dispatch(
            updateNotifications({
              smthId: data.smthId,
              type: data.type,
              incrementOrDecrement: data.incrementOrDecrement as
                | 'increment'
                | 'decrement'
            })
          );
          break;
      }
    };

    socketService.onChatUpdated(handleChatUpdate);

    const fetchProfile = async () => {
      try {
        const profile = await userService.getProfile();
        if (profile) {
          dispatch(saveProfile(profile.data));
          socketService.joinPersonalRoom(profile.data.id);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();

    return () => {
      socketService.offChatUpdated(handleChatUpdate);
      socketService.disconnect();
    };
  }, [dispatch]);

  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
