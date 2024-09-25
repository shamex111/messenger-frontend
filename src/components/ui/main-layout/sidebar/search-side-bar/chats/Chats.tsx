'use client';

import { Skeleton } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IChannelMember } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroupMember } from '@/types/group.types';

import { sortChatsFn } from '@/utils/sortChats';

import { setChats } from '@/redux/chatsSlice';
import { AppDispatch, RootState } from '@/redux/store';
import socketService from '@/socketService';

import ChatsItem from './ChatsItem';
import { useChatsData } from './useChatsItemQuery';

interface IChats {}

type TSmthType = 'channel' | 'chat' | 'group';
export interface IChatsSearchItem {
  smthId: number;
  type: TSmthType;
}

const Chats: FC<IChats> = ({}) => {
  const chats = useSelector((state: RootState) => state.chats.allChats);
  const profile = useSelector((state: RootState) => state.user.user);
  const [allChatIds, setAllChatIds] = useState<IChatsSearchItem[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, allChats } = useChatsData(allChatIds);

  useEffect(() => {
    if (profile && !chats) {
      const channelIds = (profile.channelMembers as Array<IChannelMember>).map(
        (i: IChannelMember) => i.channelId
      );
      const groupIds = (profile.groupMembers as Array<IGroupMember>).map(
        (i: IGroupMember) => i.groupId
      );
      const personalChatIds = [
        ...(profile.personalChats as Array<IChat>).map((i: any) => i.id),
        ...(profile.personalChats2 as Array<IChat>).map((i: any) => i.id)
      ];

      const allIds = [
        ...channelIds.map(id => ({ smthId: id, type: 'channel' as TSmthType })),
        ...groupIds.map(id => ({ smthId: id, type: 'group' as TSmthType })),
        ...personalChatIds.map(id => ({
          smthId: id,
          type: 'chat' as TSmthType
        }))
      ];
      setAllChatIds(allIds);
    }
  }, [profile]);

  useEffect(() => {
    if (!isLoading && allChats.length > 0 && !chats) {
      const sortedChats = sortChatsFn(allChats);
      sortedChats.map(i => {
        socketService.joinRoom(i.type, i.id);
      });
      dispatch(setChats(sortedChats));
    }
  }, [isLoading, allChats, chats, dispatch]);

  useEffect(() => {
    const handleChatUpdate = (data: {
      event:
        | 'message'
        | 'message-delete'
        | 'message-status'
        | 'notification'
        | 'online';
      messageId?: number;
      userId?: number;
    }) => {};

    socketService.onChatUpdated(handleChatUpdate); 

    return () => {
      socketService.offChatUpdated(() =>
        console.log('слушатель на изменение чата оффнут')
      );
    };
  }, []);
  return (
    <div
      className="overflow-y-auto pt-3"
      style={{
        height: 'calc(100vh - 71px)'
      }}
    >
      {isLoading ? (
        <div className="w-full h-[64px] ml-5 flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              avatar
              paragraph={{ rows: 1 }}
              active
              className="custom-skeleton"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {chats?.map((chat: any) => <ChatsItem key={chat.id} data={chat} />)}
        </div>
      )}
    </div>
  );
};

export default Chats;
