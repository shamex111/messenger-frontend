import Image from 'next/image';
import { FC } from 'react';

import { SERVER_URL_BASE } from '@/config/api.config';

import { timeCalc } from '@/utils/timeCalc';
import { userEndFormat } from '@/utils/usersEndFormat';

interface ISearchSideBarItem {
  name: string;
  avatar: string;
  qtyUsers?: number;
  lastOnline?: any;
}

const SearchSideBarItem: FC<ISearchSideBarItem> = ({
  avatar,
  name,
  qtyUsers,
  lastOnline
}) => {
  console.log(qtyUsers)
  return (
    <div className="flex ml-2 pl-3 mr-2 p-2 rounded-xl h-[64px] gap-3 hover:bg-gray hover:bg-opacity-35">
      <Image
        src={SERVER_URL_BASE + avatar}
        alt="Аватарка"
        width={50}
        height={50}
        
        className="rounded-full xl:w-[50px] xl:h-[50px] lg:w-[40px] lg:h-[40px]"
      />
      <div className="flex flex-col xl:justify-between ">
        <div className='lg:text-base xl:font-medium'>{name}</div>
        <div className='text-gray lg:text-[13px] xl:text-[15px]'>{lastOnline ?  lastOnline === 'В сети' ? 'В сети' :  timeCalc(new Date(lastOnline), true) :userEndFormat(qtyUsers as number)}</div>
      </div>
    </div>
  );
};

export default SearchSideBarItem;
