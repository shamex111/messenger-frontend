import { useUserQuery } from '../../../sidebar/search-side-bar/chats/useUserQuery';
import { Skeleton } from 'antd';
import Image from 'next/image';
import { FC } from 'react';
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import { SERVER_URL_BASE } from '@/config/api.config';

import { IMessageBase } from '@/types/message.types';

import { timeCalc } from '@/utils/timeCalc';

import { RootState } from '@/redux/store';

import styles from './ChatMessage.module.scss';

interface IChatMessage {
  message: IMessageBase;
}

const ChatMessage: FC<IChatMessage> = ({ message }) => {
  const profile = useSelector((state: RootState) => state.user.user);
  const isUserMessage = message.senderId === profile?.id;
  const { isLoading, data } = useUserQuery(message.senderId);
  const userData = data?.data
  return !isLoading ? (
    <div
      className={`${styles.wrapper} ${isUserMessage && styles.userMessagePosition}`}
    >
      {!isUserMessage && (
        <Image
          src={SERVER_URL_BASE + userData?.avatar}
          alt="avatar"
          width={45}
          height={45}
          className={styles.image}
        />
      )}
      <div className={styles.rightPart}>
        <div
          className={`${styles.contentWrapper} ${isUserMessage && styles.userMessageBg}`}
        >
          <div className={styles.infoMessage}>
            <div className="font-medium">{userData?.name}</div>
          </div>
          <div className="flex gap-3">
            <div >{message.content}</div>
            <div className="text-[13px] text-gray flex gap-2 mt-auto">
              {timeCalc(new Date(message.createdAt as string), false, true)}
              {isUserMessage && (
                <div className="mt-[2px]">
                  {message.isRead ? (
                    <IoCheckmarkDoneSharp className="text-white text-base " />
                  ) : (
                    <IoCheckmarkSharp className="text-white text-base " />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Skeleton
      avatar
      paragraph={{ rows: 1 }}
      active
      className="custom-skeleton"
    />
  );
};

export default ChatMessage;
