import { PayloadAction, createSlice } from '@reduxjs/toolkit';


interface IInitialState {
  allChats: any;
}

const initialState: IInitialState = {
  allChats: null
};

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<any>) {
      state.allChats = action.payload;
    }
  }
});

export const {setChats} = chatSlice.actions;

export default chatSlice.reducer;
