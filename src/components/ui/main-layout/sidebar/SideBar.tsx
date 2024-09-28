'use client';

import { FC, useEffect, useState } from 'react';

import styles from './SideBar.module.scss';
import Settings from './settings/Settings';
import TopSideBar from './top-sidebar/TopSideBar';
import SearchSideBar, { TSearchType } from './search-side-bar/SearchSideBar';
import Chats from './search-side-bar/chats/Chats';
import socketService, { TSmthType } from '@/socketService';
import { useChatsData } from './search-side-bar/chats/useChatsItemQuery';
import { useDispatch } from 'react-redux';
import { updateChat } from '@/redux/chatsSlice';

const SideBar: FC = () => {
  const [isSettings, setIsSettings] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [searchType, setSearchType] = useState<TSearchType>('Пользователи');

  const [data,setData] = useState([]) 
  
  
  return (
    <div className={styles.sideBarWrapper}>

        <TopSideBar
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          isSettings={isSettings}
          setIsSettings={setIsSettings}
          setIsSearch={setIsSearch}
          searchType={searchType}
          setData={setData}
        />

        {isSettings ? (
          <div className={styles.settings} >
            <Settings isEdit={isEdit} setIsEdit={setIsEdit}/>
          </div>
        ) : isSearch ? (
          <SearchSideBar data={data} searchType={searchType} setSearchType={setSearchType}/>
        ) : (
          <div className={styles.chats}><Chats/></div>
        )}
    </div>
  );
};

export default SideBar;
