import { makeAutoObservable } from 'mobx';

import { IUser } from '@/types/user.types';

class UserStore {
  user: IUser | null = null;
  constructor() {
    makeAutoObservable(this);
  }
  saveProfile(payload:IUser) {
    this.user = payload;
  }
}

const userStore = new UserStore();
export default userStore;
