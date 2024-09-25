'use client';

import { FC, PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import MainLayout from '@/components/ui/main-layout/MainLayout';

import userService from '@/services/user.service';

import { AppDispatch } from '@/redux/store';
import { saveProfile } from '@/redux/userSlice';
import socketService from '@/socketService';

const Layout: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await userService.getProfile();
        if (profile) {
          dispatch(saveProfile(profile.data));
          socketService.connect()
          socketService.joinPersonalRoom(profile.data.id);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
    return () => {
      socketService.disconnect()
    }

  }, [dispatch]);

  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
