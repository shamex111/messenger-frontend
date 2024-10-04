'use client';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import { IChannel } from '@/types/channel.types';
import { IChat } from '@/types/chat.types';
import { IGroup } from '@/types/group.types';
import { IMessageBase } from '@/types/message.types';

import { addMessages } from '@/redux/chatsSlice';
import { RootState } from '@/redux/store';
import { TSmthType } from '@/socketService';

import styles from './Chat.module.scss';
import ChatMessage from './chat-messages/ChatMessage';
import { useChatMutation } from './useChatMutation';
import { useMessageQuery } from './useMessagesQuery';

interface IIChat {
  data: IChat | IChannel | IGroup;
}

const Chat: FC<IIChat> = ({ data }) => {
  const dispatch = useDispatch();
  const [isAtBottom, setIsAtBottom] = useState(
    (data.messages as Array<any>)?.length <= 20
  );
  const [isAtTop, setIsAtTop] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | null>(null);
  const observerRefs = useRef<Map<number, IntersectionObserver>>(new Map());
  const { mutate } = useChatMutation();
  const userId = useSelector((state: RootState) => state.user.user?.id);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const {
    isLoading,
    data: messageData,
    error
  } = useMessageQuery({
    count: isAtTop ? 30 : null,
    smthId: isAtTop ? (data.id as number) : null,
    type: isAtTop ? (data.type as TSmthType) : null,
    lastMessageId: isAtTop
      ? (data.messages as Array<any>)[(data.messages?.length as number) - 1]?.id
      : null
  });

  const markMessageAsRead = useCallback(
    (messageId: number, senderId: number, isRead: boolean) => {
      if (userId !== senderId && !isRead) mutate(messageId);
    },
    [userId, mutate]
  );

  useEffect(() => {
    if (!isLoading && messageData) {
      const chatContainer = chatContainerRef.current;

      if (chatContainer) {
        setPrevScrollHeight(chatContainer.scrollHeight);
      }

      dispatch(
        addMessages({
          type: data.type as TSmthType,
          smthId: data.id as number,
          newMessages: messageData.data
        })
      );
      setIsAtTop(false);
    }

    if (error) toast.error(error.message);
  }, [isLoading, messageData, error]);

  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
      setIsAtTop(scrollTop === 0);
    }
  }, []);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (chatContainer && prevScrollHeight !== null) {
      const currentScrollHeight = chatContainer.scrollHeight;
      const scrollDiff = currentScrollHeight - prevScrollHeight;

      chatContainer.scrollTop += scrollDiff;
    }

    if (isAtBottom) {
      scrollToBottom();
    }
  }, [data?.messages]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer && data?.messages) {
      data.messages.forEach((message: IMessageBase) => {
        const messageElement = document.getElementById(`message-${message.id}`);

        if (messageElement) {
          const observer = new IntersectionObserver(
            entries => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  markMessageAsRead(
                    message.id as number,
                    message.senderId as number,
                    message.isRead as boolean
                  );
                  observer.disconnect();
                }
              });
            },
            { root: chatContainer, threshold: 0.2 }
          );

          observer.observe(messageElement);
          observerRefs.current.set(message.id as number, observer);
        }
      });
    }

    return () => {
      observerRefs.current.forEach(observer => observer.disconnect());
    };
  }, [data?.messages]);

  const renderMessages = useMemo(() => {
    return (
      data?.messages &&
      [...data.messages].reverse().map((m: IMessageBase, ind: number) => {

        return (
          <ChatMessage
            message={m}
            key={m.id}
            id={m.id as number}
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
        );
      })
    );
  }, [data.messages]);

  return (
    <div
      className={styles.wrapper}
      ref={chatContainerRef}
      onScroll={handleScroll}
    >
      <div className="mx-auto w-[60%] flex flex-col gap-[10px] mt-2">
        {renderMessages?.length ? (
          renderMessages
        ) : (
          <div className="mx-auto  mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md w-fit">
            Здесь пока-что пусто
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chat;
