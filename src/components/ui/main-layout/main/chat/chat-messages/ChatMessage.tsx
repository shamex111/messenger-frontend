import { useUserQuery } from '../../../sidebar/search-side-bar/chats/useUserQuery';
import { Skeleton } from 'antd';
import Image from 'next/image';
import { FC } from 'react';
import { BsFillEyeFill } from 'react-icons/bs';
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import { SERVER_URL_BASE } from '@/config/api.config';

import { IMessageBase } from '@/types/message.types';

import { formatViews } from '@/utils/formatViews';
import { isOtherDayFn } from '@/utils/isOtherDay';
import { timeCalc } from '@/utils/timeCalc';

import { RootState } from '@/redux/store';
import { TSmthType } from '@/socketService';

import styles from './ChatMessage.module.scss';

interface IChatMessage {
  message: IMessageBase;
  type: TSmthType;
  beforeMessage: IMessageBase;
  afterMessage: IMessageBase;
  id: number;
}

const ChatMessage: FC<IChatMessage> = ({
  message,
  type,
  afterMessage,
  beforeMessage,
  id
}) => {
  const profile = useSelector((state: RootState) => state.user.user);
  const isNotChannel = type !== 'channel';
  const isUserMessage = message.senderId === profile?.id && isNotChannel;
  const { isLoading, data } = useUserQuery(message.senderId);
  const userData = data?.data;
  const params = {
    isFirst:
      (!beforeMessage || beforeMessage.senderId !== message.senderId) &&
      afterMessage?.senderId === message.senderId,
    isMiddle:
      beforeMessage?.senderId === message.senderId &&
      afterMessage?.senderId === message.senderId,
    isLast:
      beforeMessage?.senderId === message.senderId &&
      (!afterMessage || afterMessage.senderId !== message.senderId)
  };

  const isOtherDay = isOtherDayFn(
    new Date(beforeMessage?.createdAt as string),
    new Date(message.createdAt as string)
  );
  return !isLoading ? (
    <div className="w-full flex flex-col " id={`message-${id}`}>
      {isOtherDay && (
        <div className="mx-auto mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md w-fit">
          {isOtherDay}
        </div>
      )}
      <div
        className={`${styles.wrapper} ${isUserMessage && styles.userMessagePosition}`}
      >
        {!isUserMessage && isNotChannel && (
          <>
            {params.isLast ||
            (!params.isFirst && !params.isMiddle && !params.isLast) ? (
              <Image
                src={SERVER_URL_BASE + userData?.avatar}
                alt="avatar"
                width={45}
                height={45}
                className={styles.image}
              />
            ) : (
              <div className={styles.image} />
            )}
          </>
        )}
        <div className={styles.rightPart}>
          <div
            className={`${styles.contentWrapper} ${isUserMessage && styles.userMessageBg} ${params.isFirst && isNotChannel && styles.first} ${params.isMiddle && isNotChannel && styles.middle} ${params.isLast && isNotChannel && styles.last} `}
          >
            <div className={styles.infoMessage}>
              {isNotChannel && (
                <div className="font-medium">
                  {isNotChannel && params.isFirst && userData?.name}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <div style={{
                "wordBreak":"break-word",
              }}>{message.content}</div>
              <div className="text-[13px] text-gray flex mt-auto">
                <div className="text-xs mt-auto mr-1">
                  {message.isEdit ? 'изменено' : ""}
                </div>
                <div className={`${isNotChannel ? 'mr-2' : 'gap-2'} flex`}>
                  <div className="mt-auto">
                    {!isNotChannel && (
                      <div className="flex ">
                        <BsFillEyeFill className="my-auto mr-1" />
                        {formatViews(message.readChannels.length)}
                      </div>
                    )}
                  </div>
                  <div>
                    {timeCalc(
                      new Date(message.createdAt as string),
                      false,
                      true
                    )}
                  </div>
                </div>
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
