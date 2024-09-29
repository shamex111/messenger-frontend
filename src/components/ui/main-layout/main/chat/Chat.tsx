import { FC, useEffect, useRef, useState } from 'react';

import { IChannel } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroup } from '@/types/group.types';
import { IMessageBase } from '@/types/message.types';

import { TSmthType } from '@/socketService';

import styles from './Chat.module.scss';
import ChatMessage from './chat-messages/ChatMessage';

interface IIChat {
  data: IChat | IChannel | IGroup;
}

const Chat: FC<IIChat> = ({ data }) => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [data?.messages]);

  return (
    <div
      className={styles.wrapper}
      ref={chatContainerRef}
      onScroll={handleScroll}
    >
      <div className="mx-auto w-[60%] flex flex-col gap-[10px] mt-2">
        {data?.messages &&
          [...data.messages]
            .reverse()
            .map((m: IMessageBase, ind: number) => (
              <ChatMessage
                message={m}
                key={m.createdAt}
                type={data.type as TSmthType}
                beforeMessage={
                  ind !== 0
                    ? (data.messages as Array<any>)[
                        (data.messages as Array<any>).length - 1 - (ind - 1)
                      ]
                    : null
                }
                afterMessage={
                  ind !== (data.messages as Array<any>).length - 1
                    ? (data.messages as Array<any>)[
                        (data.messages as Array<any>).length - 1 - (ind + 1)
                      ]
                    : null
                }
              />
            ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chat;
