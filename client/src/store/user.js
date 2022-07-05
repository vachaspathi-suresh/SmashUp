import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  avatar: null,
  name: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    setAvatar(state, action) {
      state.avatar = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
