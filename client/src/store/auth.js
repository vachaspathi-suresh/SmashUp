import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userId: null,
  token: null,
  login: null,
  logout: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setUID(state, action) {
      state.userId = action.payload;
    },
    setLogin(state, action) {
      state.login = action.payload;
    },
    setLogout(state, action) {
      state.logout = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
