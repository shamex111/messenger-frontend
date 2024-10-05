'use client';

import { Skeleton } from 'antd';
import { FC, useEffect, useState } from 'react';

import { useStores } from '@/components/ui/chatStoreProvider';

import { IChannelMember } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroupMember } from '@/types/group.types';

import { sortChatsFn } from '@/utils/sortChats';

import socketService, { TSmthType } from '@/socketService';

import ChatsItem from './ChatsItem';
import { useChatsData } from './useChatsItemQuery';

interface IChats {}

export interface IChatsSearchItem {
  smthId: number;
  type: TSmthType;
}

const Chats: FC<IChats> = ({}) => {
  const { chatStore, userStore } = useStores();
  const chats = Array.from(chatStore.allChats.values());
  const profile = userStore.user
  const [allChatIds, setAllChatIds] = useState<IChatsSearchItem[]>([]);
  const { isLoading, allChats } = useChatsData(allChatIds);
  const [forReload, reload] = useState('');

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
        if (i.type === 'chat') {
          const otherUserId: number =
            profile?.id === i.user1Id ? i.user2Id : i.user1Id;
          socketService.subscribeToStatus([otherUserId]);
        }
      });
      const handleOnlineChange = (data: {
        event: 'offline' | 'online';
        userId:number
      }) => {
        chatStore.
          changeUserFromChatOnline({
            userId:data.userId,
            event: data.event,
          })
        
      };

      socketService.setStatusOnline(handleOnlineChange);
      chatStore.setChats(sortedChats);
    }
  }, [isLoading, allChats, chats, chatStore]);

  return (
    <div
      className={`overflow-y-auto pt-3 `}
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
          {chats?.map((chat: any) => (
            <ChatsItem reload={reload} key={chat.id} data={chat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Chats;
