'use client';

import clsx from 'clsx';
import { FC, useState } from 'react';

import { IChannel } from '@/types/channel.types';
import { IGroup } from '@/types/group.types';
import { IUser } from '@/types/user.types';

import SearchSideBarItem from './searchSideBarItem/SearchSideBarItem';

interface ISearchSideBar {
  setSearchType: any;
  searchType: TSearchType;
  data: any
}

export type TSearchType = 'Пользователи' | 'Группы' | 'Каналы';
const SearchSideBar: FC<ISearchSideBar> = ({
  searchType,
  setSearchType,
  data
}) => {
  return (
    <div>
      <div className="flex justify-between w-full lg:text-xs pt-3 text-gray xl:text-sm font-medium border-b-border border-b-[2px] select-none">
        <div
          className={clsx(
            'w-[33.33%] pl-2 cursor-pointer pb-2 pt-3 hover:bg-gray hover:bg-opacity-10 rounded-t-md',
            searchType === 'Пользователи' &&
              'text-accent border-b-2 border-b-accent' // Пример класса для активного состояния
          )}
          onClick={() => setSearchType('Пользователи')}
        >
          <p className="mx-auto w-fit">Пользователи</p>
        </div>
        <div
          className={clsx(
            'w-[33.33%] cursor-pointer pb-2 pt-3 hover:bg-gray hover:bg-opacity-10 rounded-t-md',
            searchType === 'Группы' && 'text-accent border-b-2 border-b-accent'
          )}
          onClick={() => setSearchType('Группы')}
        >
          <p className="mx-auto w-fit">Группы</p>
        </div>
        <div
          className={clsx(
            'w-[33.33%] cursor-pointer pb-2 pt-3 hover:bg-gray hover:bg-opacity-10 rounded-t-md',
            searchType === 'Каналы' && 'text-accent border-b-2 border-b-accent'
          )}
          onClick={() => setSearchType('Каналы')}
        >
          <p className="mx-auto w-fit">Каналы</p>
        </div>
      </div>
      <div className="flex flex-col gap-[7px] pt-[20px] overflow-y-auto " style={{
      height:'calc(100vh - 127px)'
    }}>
        {data.length
          ? data.map((i:any) => (
              <SearchSideBarItem
                name={i.name}
                avatar={i.avatar}
                lastOnline={
                  (i?.lastOnline) ? (i.isOnline ? 'В сети' : i?.lastOnline) : null
                }
                key={i.id}
                qtyUsers={i?.qtyUsers ? i?.qtyUsers : null}
              />
            ))
          : <div className='ml-4 '>Ничего не найдено</div>}
      </div>
    </div>
  );
};

export default SearchSideBar;
