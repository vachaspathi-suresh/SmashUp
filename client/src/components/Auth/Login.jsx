import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Link,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  LoginRounded,
  LockOutlined,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useInput from "../../hooks/use-input";
import useHTTP from "../../hooks/use-http";
import Loader from "../UI/Loader";
import { userActions } from "../../store/user";
import {
  loginRoute,
  signupRoute,
  getUserNamesRoute,
} from "../../utils/APIRoutes";

const toastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let userNamesList = useRef();
  const [isSignin, setIsSignin] = useState(true);
  const [isShowPassword, setShowPassword] = useState(false);
  const [isUnameTaken, setIsUnameTaken] = useState(false);

  const { isLoading: getLoading, sendRequest: getSendRequest } = useHTTP();
  const { isLoading, clearError, sendRequest } = useHTTP();
  const login = useSelector((state) => state.auth.login);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    onBlurHandler: emailBlurHandler,
  } = useInput((value) => value.includes("@") && value.includes("."));

  const {
    value: unameValue,
    isValid: unameIsValid,
    hasError: unameHasError,
    valueChangeHandler: unameChangeHandler,
    onBlurHandler: unameBlurHandler,
  } = useInput((value) => value.length > 3 && /^[a-z0-9_.]+$/.test(value));

  const {
    value: passValue,
    isValid: passIsValid,
    hasError: passHasError,
    valueChangeHandler: passChangeHandler,
    onBlurHandler: passBlurHandler,
  } = useInput((value) => value.length > 7);

  const {
    value: cpassValue,
    isValid: cpassIsValid,
    hasError: cpassHasError,
    valueChangeHandler: cpassChangeHandler,
    onBlurHandler: cpassBlurHandler,
  } = useInput((value) => value === passValue && passIsValid);

  const {
    value: fnValue,
    isValid: fnIsValid,
    hasError: fnHasError,
    valueChangeHandler: fnChangeHandler,
    onBlurHandler: fnBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: lnValue,
    isValid: lnIsValid,
    hasError: lnHasError,
    valueChangeHandler: lnChangeHandler,
    onBlurHandler: lnBlurHandler,
  } = useInput((value) => value.trim() !== "");

  useEffect(() => {
    const getUsernames = async () => {
      try {
        const responseData = await getSendRequest(
          getUserNamesRoute,
          "POST",
          null,
          { "Content-Type": "application/json" }
        );
        userNamesList.current = responseData.usernames;
      } catch (err) {
        toast.error(err.message, toastOptions);
      }
    };
    getUsernames();
  }, [getSendRequest]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !isSignin &&
      (!unameIsValid || !cpassIsValid || !fnIsValid || !lnIsValid)
    ) {
      emailBlurHandler();
      passBlurHandler();
      cpassBlurHandler();
      unameBlurHandler();
      fnBlurHandler();
      lnBlurHandler();
      return;
    }

    if (!emailIsValid || !passIsValid) {
      emailBlurHandler();
      passBlurHandler();
      return;
    }

    const data = new FormData(event.currentTarget);
    if (isSignin) {
      try {
        const dataResponse = await sendRequest(
          loginRoute,
          "POST",
          JSON.stringify({
            username: data.get("email"),
            password: data.get("password"),
          }),
          { "Content-Type": "application/json" }
        );
        login(dataResponse.userId, dataResponse.token);
        dispatch(userActions.setAvatar(dataResponse.avatar));
        dispatch(userActions.setUsername(dataResponse.username));
        dispatch(userActions.setName(dataResponse.name));
      } catch (err) {
        toast.error(err.message, {
          ...toastOptions,
          onClose: () => {
            clearError();
          },
        });
      }
    } else {
      try {
        const dataResponse = await sendRequest(
          signupRoute,
          "POST",
          JSON.stringify({
            email: data.get("email"),
            username: data.get("username"),
            name: `${data.get("first-name")} ${data.get("last-name")}`,
            password: data.get("confirm-password"),
          }),
          { "Content-Type": "application/json" }
        );
        login(dataResponse.userId, dataResponse.token);
        dispatch(userActions.setUsername(dataResponse.username));
        dispatch(userActions.setName(dataResponse.name));
        navigate("/avatar");
      } catch (err) {
        toast.error(err.message, {
          ...toastOptions,
          onClose: () => {
            clearError();
          },
        });
      }
    }
  };

  const userNameBlurHandler = () => {
    unameBlurHandler();
    if (userNamesList.current.includes(unameValue)) {
      setIsUnameTaken(true);
    } else {
      setIsUnameTaken(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      {getLoading ? (
        <Loader />
      ) : (
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              marginTop: 8,
              padding: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "#4D4C7D" }}>
              {isSignin ? <LoginRounded /> : <LockOutlined />}
            </Avatar>
            <Typography component="h1" variant="h5">
              {`Sign ${isSignin ? "In" : "Up"}`}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              {!isSignin && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First Name"
                        required
                        autoComplete="given-name"
                        id="first-name"
                        name="first-name"
                        margin="normal"
                        value={fnValue}
                        onChange={fnChangeHandler}
                        onBlur={fnBlurHandler}
                        error={fnHasError}
                        helperText={fnHasError && "Field can't be empty"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        required
                        autoComplete="family-name"
                        id="last-name"
                        name="last-name"
                        margin="normal"
                        value={lnValue}
                        onChange={lnChangeHandler}
                        onBlur={lnBlurHandler}
                        error={lnHasError}
                        helperText={lnHasError && "Field can't be empty"}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    label="UserName"
                    required
                    fullWidth
                    autoComplete="username"
                    id="username"
                    name="username"
                    margin="normal"
                    value={unameValue}
                    onChange={unameChangeHandler}
                    onBlur={userNameBlurHandler}
                    error={unameHasError || isUnameTaken}
                    helperText={
                      (unameHasError &&
                        "Not Valid(smallerCase,numbers,dot,underscore)") ||
                      (isUnameTaken && "Username already taken")
                    }
                  />
                </>
              )}
              <TextField
                label="Email Address"
                required
                fullWidth
                autoComplete="email"
                id="email"
                name="email"
                margin="normal"
                value={emailValue}
                onChange={emailChangeHandler}
                onBlur={emailBlurHandler}
                error={emailHasError}
                helperText={emailHasError && "Enter Valid Email Address"}
              />
              <TextField
                label="Password"
                type={isShowPassword ? "text" : "password"}
                required
                fullWidth
                autoComplete="current-password"
                id="password"
                name="password"
                margin="normal"
                value={passValue}
                onChange={passChangeHandler}
                onBlur={passBlurHandler}
                error={passHasError}
                helperText={
                  passHasError &&
                  "Password should contain at least 8 characters"
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {isShowPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {!isSignin && (
                <TextField
                  label="Confirm Password"
                  type="password"
                  required
                  fullWidth
                  autoComplete="current-password"
                  id="confirm-password"
                  name="confirm-password"
                  margin="normal"
                  value={cpassValue}
                  onChange={cpassChangeHandler}
                  onBlur={cpassBlurHandler}
                  error={cpassHasError}
                  helperText={cpassHasError && "Password not matched"}
                />
              )}
              <Button
                disabled={isLoading}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ my: 2 }}
              >
                {isLoading
                  ? `Signing ${isSignin ? "in" : "up"}...`
                  : `Sign ${isSignin ? "In" : "Up"}`}
              </Button>
              {isSignin ? (
                <Grid container>
                  <Grid item xs>
                    <Link
                      component="button"
                      onClick={() => {
                        navigate("/auth/forget-password");
                      }}
                      variant="body2"
                    >
                      Forget Password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      component="button"
                      onClick={() => {
                        setIsSignin(false);
                      }}
                      variant="body2"
                    >
                      Don't have an account? Sign Up
                    </Link>
                  </Grid>
                </Grid>
              ) : (
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link
                      component="button"
                      onClick={() => {
                        setIsSignin(true);
                      }}
                      variant="body2"
                    >
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Container>
      )}
    </>
  );
};

export default Login;
