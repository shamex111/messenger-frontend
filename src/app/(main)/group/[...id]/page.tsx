'use client';

import { useParams } from 'next/navigation';
import { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import Chat from '@/components/ui/main-layout/main/chat/Chat';
import MainTopInfoBar from '@/components/ui/main-layout/main/main-top-info-bar/MainTopInfoBar';
import TypingArea from '@/components/ui/main-layout/main/typing-area/TypingArea';
import SideInfoBar from '@/components/ui/main-layout/sideinfobar/SideInfoBar';

import { RootState } from '@/MobX/store';

import styles from './group.module.scss';

const page: FC = () => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState<boolean>(false);

  const { id } = useParams();
  const chatId = Number(id[0]);
  const chats = useSelector((state: RootState) => state.chats.allChats);

  const chat = useMemo(() => {
    return chats?.find(
      (chat: any) => chat.id === chatId && chat.type === 'group'
    );
  }, [chats, chatId]);

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
            <TypingArea type={chat.type} smthId={chat.id} />
          </div>
          <SideInfoBar isInfoBarOpen={isInfoBarOpen} />
        </>
      ) : (
        <div>Чат не найден</div>
      )}
    </div>
  );
};

export default page;
