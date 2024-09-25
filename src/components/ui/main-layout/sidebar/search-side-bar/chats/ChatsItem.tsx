'use client';

import { Skeleton } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import toast from 'react-hot-toast';
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from 'react-icons/io5';
import { TbPointFilled } from 'react-icons/tb';
import { useSelector } from 'react-redux';

import { SERVER_URL_BASE } from '@/config/api.config';

import { timeCalc } from '@/utils/timeCalc';

import { RootState } from '@/redux/store';

import { useUserQuery } from './useUserQuery';

export interface IChatsItem {
  data: any;
}

const ChatsItem: FC<IChatsItem> = ({ data }) => {
  const profile = useSelector((state: RootState) => state.user.user);
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const isActive = path === `/${data.type}/${data.id}`;
  const userId = profile?.id as number;

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError
  } = data.type === 'chat'
    ? useUserQuery(data?.user1Id === userId ? data?.user2Id : data?.user1Id)
    : { data: null, isLoading: false, error: null };

  if (isUserLoading)
    return (
      <Skeleton
        avatar
        paragraph={{ rows: 1 }}
        active
        className="custom-skeleton ml-5"
      />
    );
  if (userError) {
    toast.error(userError?.message as string);
    return <div>Error loading data</div>;
  }

  const lastMessage = data.messages[0];
  return (
    <Link href={`/${data.type}/${data.id}`}>
      <div
        className={`flex ml-2 pl-3 mr-2 p-2 rounded-xl h-[64px] gap-3 cursor-pointer ${isActive ? 'bg-accent bg-opacity-60' : 'hover:bg-gray hover:bg-opacity-35'}`}
      >
        {data.type === 'chat' ? (
          <>
            <div>
              <Image
                src={SERVER_URL_BASE + userData?.data.avatar}
                alt="Аватарка"
                width={50}
                height={50}
                className="rounded-full w-[50px] h-[50px]"
              />
              {userData?.data.isOnline && (
                <TbPointFilled
                  color="#0ac630"
                  className="relative bottom-5 left-8 font-semibold text-2xl"
                />
              )}
            </div>
            <div className="flex flex-col justify-between">
              <div>{userData?.data.name}</div>
              <div className="text-gray text-[14.5px]">
                {lastMessage?.content || 'Сообщений нет'}
              </div>
            </div>
          </>
        ) : (
          <>
            <Image
              src={SERVER_URL_BASE + data.avatar}
              alt="Аватарка"
              width={50}
              height={50}
              className="rounded-full w-[50px] h-[50px]"
            />
            <div className="flex flex-col justify-between">
              <div className="font-medium">{data?.name}</div>
              <div
                className={`${isActive ? 'text-white' : 'text-gray'} text-[13.5px]`}
              >
                {lastMessage?.content
                  ? `${lastMessage.content.substr(0, 14)}${lastMessage.content.length > 14 ? '...' : ''}`
                  : 'Сообщений нет'}
              </div>
            </div>
          </>
        )}
        {lastMessage && (
          <div className="ml-auto flex flex-col justify-between">
            <div className={`text-sm ${isActive ? 'text-white' : 'text-gray'}`}>
              {timeCalc(new Date(lastMessage.createdAt), false)}
            </div>
            <div>
              {lastMessage.senderId === profile?.id &&
                (lastMessage.isRead ? (
                  <IoCheckmarkDoneSharp
                    className={`ml-auto mt-auto ${isActive ? 'text-white' : 'text-accent'}`}
                  />
                ) : (
                  <IoCheckmarkSharp
                    className={`ml-auto mt-auto ${isActive ? 'text-white' : 'text-gray'}`}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ChatsItem;
