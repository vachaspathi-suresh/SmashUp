import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Typography,
  Button,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Key,
  VisibilityOff,
  Visibility,
  ReportGmailerrorred,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useInput from "../hooks/use-input";
import useHTTP from "../hooks/use-http";
import Loader from "../components/UI/Loader";
import { verifyResetRoute, resetPasswordRoute } from "../utils/APIRoutes";

const toastOptions = {
  position: "top-center",
  autoClose: 15000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isShowNPassword, setShowNPassword] = useState(false);

  const { isLoading, clearError, sendRequest } = useHTTP();
  const {
    isLoading: verifying,
    error: verifyError,
    sendRequest: verifyToken,
  } = useHTTP();

  const {
    value: nPassValue,
    isValid: nPassIsValid,
    hasError: nPassHasError,
    valueChangeHandler: nPassChangeHandler,
    onBlurHandler: nPassBlurHandler,
  } = useInput((value) => value.length > 7);

  const {
    value: cpassValue,
    isValid: cpassIsValid,
    hasError: cpassHasError,
    valueChangeHandler: cpassChangeHandler,
    onBlurHandler: cpassBlurHandler,
  } = useInput((value) => value === nPassValue && nPassIsValid);

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyToken(
          verifyResetRoute,
          "POST",
          JSON.stringify({
            token: searchParams.get("ratuid"),
            uid: searchParams.get("rsid"),
          }),
          { "Content-Type": "application/json" }
        );
      } catch (err) {
        console.error(err);
      }
    };
    verify();
  }, [searchParams, verifyToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nPassIsValid || !cpassIsValid) {
      nPassBlurHandler();
      cpassBlurHandler();
      return;
    }

    const data = new FormData(event.currentTarget);
    try {
      await sendRequest(
        resetPasswordRoute,
        "POST",
        JSON.stringify({
          token: searchParams.get("ratuid"),
          uid: searchParams.get("rsid"),
          newPassword: data.get("confirm-password"),
        }),
        { "Content-Type": "application/json" }
      );
      toast.success(
        "Your Password is successfully Updated, Please Login",
        toastOptions
      );
    } catch (err) {
      toast.error(err.message, {
        ...toastOptions,
        onClose: () => {
          clearError();
        },
      });
    }
  };

  return (
    <>
      {verifying ? (
        <Loader />
      ) : !!verifyError ? (
        <Container
          component="main"
          maxWidth="md"
          sx={{
            marginTop: 8,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
          }}
        >
          <ReportGmailerrorred
            sx={{ m: 1, fontSize: "5rem", color: "whitesmoke" }}
          />
          <Typography variant="h3" color="whitesmoke" lineHeight="1.5">
            Oops, this link is expired
          </Typography>
          <Typography variant="body" color="white" lineHeight="2">
            This URL is not valid anymore.
          </Typography>
          <Button
            variant="contained"
            size="medium"
            sx={{ my: 2, maxWidth: "fit-content" }}
            onClick={() => {
              navigate("/");
            }}
          >
            Go to home
          </Button>
        </Container>
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
            <Avatar sx={{ m: 1, bgcolor: "#4D4C7D" }}>{<Key />}</Avatar>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                label="New Password"
                type={isShowNPassword ? "text" : "password"}
                required
                fullWidth
                autoComplete="current-password"
                id="new-password"
                name="new-password"
                margin="normal"
                value={nPassValue}
                onChange={nPassChangeHandler}
                onBlur={nPassBlurHandler}
                error={nPassHasError}
                helperText={
                  nPassHasError &&
                  "Password should contain at least 8 characters"
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setShowNPassword((prev) => !prev);
                        }}
                        edge="end"
                      >
                        {isShowNPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm New Password"
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
              <Button
                disabled={isLoading}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ my: 2 }}
              >
                {isLoading ? "Resetting..." : "Reset"}
              </Button>
            </Box>
          </Paper>
          <ToastContainer
            position="top-center"
            autoClose={15000}
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

export default ResetPassword;
