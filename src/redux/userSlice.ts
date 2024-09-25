import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IUser, UserState } from '@/types/user.types';

const initialState: UserState = {
  user: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveProfile(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    }
  }
});

export const { saveProfile } = userSlice.actions;

export default userSlice.reducer;
