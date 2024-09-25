import Image from 'next/image';
import { FC } from 'react';
import { CgMenuRight } from 'react-icons/cg';
import { RiUserAddLine } from 'react-icons/ri';

import { SERVER_URL_BASE } from '@/config/api.config';

import { userEndFormat } from '@/utils/usersEndFormat';

import style from './MainTopInfoBar.module.scss';

interface IMainTopInfoBar {
  name: string;
  qtyUsers?: number;
  lastOnline?: any;
  smthId: number;
  type: 'channel' | 'group' | 'chat';
  avatar: string;
  isInfoBarOpen: boolean;
  setIsInfoBarOpen: any;
}

const MainTopInfoBar: FC<IMainTopInfoBar> = ({
  name,
  qtyUsers,
  lastOnline,
  smthId,
  type,
  avatar,
  isInfoBarOpen,
  setIsInfoBarOpen
}) => {
  return (
    <header className={style.wrapper}>
      <div className={style.leftBar}>
        <Image
          src={SERVER_URL_BASE + avatar}
          alt="Автарка"
          width={42}
          height={42}
          className="h-[42px] w-[42px] rounded-full "
        />
        <div>
          <h3>{name}</h3>
          <p>
            {type === 'chat' ? lastOnline : userEndFormat(qtyUsers as number)}{' '}
          </p>
        </div>
      </div>
      <div className={style.rightBar}>
        <div>
          <RiUserAddLine className="my-auto h-fit" />
        </div>
        <div
          className={isInfoBarOpen ? style.active : undefined}
          onClick={() => setIsInfoBarOpen(!isInfoBarOpen)}
        >
          <CgMenuRight className="my-auto h-fit" />
        </div>
      </div>
    </header>
  );
};

export default MainTopInfoBar;
