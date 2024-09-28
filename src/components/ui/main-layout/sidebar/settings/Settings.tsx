'use client';

import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import userService from '@/services/user.service';
import { IUser } from '@/types/user.types';
import { AppDispatch, RootState } from '@/redux/store';
import { saveProfile } from '@/redux/userSlice';
import socketService from '@/socketService';

import EditSettings from './edit-settings/EditSettings';
import InfoSettings from './info-settings/InfoSettings';

interface ISettings {
  isEdit: boolean;
  setIsEdit:any,
  
}

const Settings: FC<ISettings> = ({ isEdit,setIsEdit }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleUserUpdate = async () => {
      try {
        const profile = await userService.getProfile();
        dispatch(saveProfile(profile.data));
        console.log('Профиль пользователя обновлен');
      } catch (error) {
        console.error('Не удалось обновить профиль пользователя:', error);
      }
    };

    const socket = socketService.getSocket();
    if (socket) {
      socket.on('edit-user', handleUserUpdate);
    }

    return () => {
      if (socket) {
        socket.off('edit-user', handleUserUpdate);
      }
    };
  }, []); 
 
  return (
    <div>
      {!isEdit ? (
        <InfoSettings user={user as IUser} />
      ) : (
        <EditSettings user={user as IUser} setIsEdit={setIsEdit} />
      )}
    </div>
  );
};

export default Settings;
