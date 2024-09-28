import { FC, useEffect, useRef, useState } from 'react';

import { IChannel } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroup } from '@/types/group.types';
import { IMessageBase } from '@/types/message.types';

import styles from './Chat.module.scss';
import ChatMessage from './chat-messages/ChatMessage';

interface IIChat {
  data: IChat | IChannel | IGroup;
}

const Chat: FC<IIChat> = ({ data }) => {
  const [isAtBottom, setIsAtBottom] = useState(true); // Состояние для отслеживания, находится ли пользователь внизу чата
  const chatContainerRef = useRef<HTMLDivElement>(null); // Реф для контейнера с сообщениями
  const messagesEndRef = useRef<HTMLDivElement>(null); // Реф для конца списка сообщений

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); // Плавная прокрутка
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      // Проверяем, находится ли пользователь близко к нижней части чата
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  useEffect(() => {
    // Прокручиваем чат вниз, только если пользователь уже внизу
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [data?.messages]); // Прокручиваем при изменении сообщений

  return (
    <div
      className={styles.wrapper}
      ref={chatContainerRef}
      onScroll={handleScroll} // Отслеживаем скролл
    >
      <div className="mx-auto w-[60%] flex flex-col gap-3 mt-2">
        {data?.messages && [...data.messages].reverse().map((m: IMessageBase) => (
          <ChatMessage message={m} key={m.createdAt} />
        ))}
        {/* Реф для конца списка сообщений */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chat;
