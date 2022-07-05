import React, { Suspense, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { purple } from "@mui/material/colors";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useAuth } from "./hooks/use-auth";
import { authActions } from "./store/auth";
import Loader from "./components/UI/Loader";

const Error = React.lazy(() => import("./pages/Error"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Chat = React.lazy(() => import("./pages/Chat"));
const Avatar = React.lazy(() => import("./pages/SetAvatar"));
const ForgetPassword = React.lazy(() => import("./pages/ForgetPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));

const theme = createTheme({
  palette: {
    primary: {
      main: purple[800],
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const { token, login, logout, userId } = useAuth();

  useEffect(() => {
    dispatch(authActions.setIsLoggedIn(!!token));
    dispatch(authActions.setToken(token));
    dispatch(authActions.setUID(userId));
    dispatch(authActions.setLogin(login));
    dispatch(authActions.setLogout(logout));
  }, [dispatch, token, userId, login, logout]);

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={!!token ? <Chat /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!!token ? <Navigate to="/" /> : <Auth />}
          />
          <Route path="/avatar" element={<Avatar />} />
          <Route
            path="/chat"
            element={!!token ? <Navigate to="/" /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth/forget-password"
            element={!!token ? <Navigate to="/" /> : <ForgetPassword />}
          />
          <Route
            path="/auth/reset-password"
            element={!!token ? <Navigate to="/" /> : <ResetPassword />}
          />
          <Route path="/*" element={<Error />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
