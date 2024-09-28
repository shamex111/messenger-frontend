'use client';

import { useParams } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import Chat from '@/components/ui/main-layout/main/chat/Chat';
import MainTopInfoBar from '@/components/ui/main-layout/main/main-top-info-bar/MainTopInfoBar';
import TypingArea from '@/components/ui/main-layout/main/typing-area/TypingArea';
import SideInfoBar from '@/components/ui/main-layout/sideinfobar/SideInfoBar';

import { IChannelMember } from '@/types/channel.types';

import { RootState } from '@/redux/store';
import socketService from '@/socketService';

import styles from './channel.module.scss';

const Page: FC = () => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState<boolean>(false);

  const { id } = useParams();
  const chatId = Number(id[0]);
  const chats = useSelector((state: RootState) => state.chats.allChats);

  const chat = useMemo(() => {
    return chats?.find(
      (chat: any) => chat.id === chatId && chat.type === 'channel'
    );
  }, [chats, chatId]);

  

  console.log(chat);

  return (
    <div className={styles.wrapper}>
      {chat ? (
        <>
          <div className={styles.main}>
            <MainTopInfoBar
              name={chat.name}
              qtyUsers={chat.qtyUsers}
              smthId={chatId}
              type="channel"
              avatar={chat.avatar}
              isInfoBarOpen={isInfoBarOpen}
              setIsInfoBarOpen={setIsInfoBarOpen}
            />
            <Chat data={chat} />
            <TypingArea type={chat.type} smthId={chat.id}/>
          </div>
          <SideInfoBar isInfoBarOpen={isInfoBarOpen} />
        </>
      ) : (
        <div>Чат не найден</div>
      )}
    </div>
  );
};

export default Page;
