import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("access_token");

const initialState = {
  user: null,
  accessToken: token,
  isLoggedIn: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload;
      state.isLoggedIn = true;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isLoggedIn = false;

      localStorage.removeItem("access_token");
    },
  },
});

export const { login, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
