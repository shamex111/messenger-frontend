import { configureStore } from '@reduxjs/toolkit';

import chatsReducer from './chatsSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
