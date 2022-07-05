import React from "react";
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
} from "@mui/material";
import { Key } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useInput from "../../hooks/use-input";
import useHTTP from "../../hooks/use-http";
import { forgetPasswordRoute } from "../../utils/APIRoutes";

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

const ForgetPasswordForm = () => {
  const navigate = useNavigate();

  const { isLoading, clearError, sendRequest } = useHTTP();

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    onBlurHandler: emailBlurHandler,
  } = useInput((value) => value.includes("@") && value.includes("."));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!emailIsValid) {
      emailBlurHandler();
      return;
    }

    try {
      await sendRequest(
        forgetPasswordRoute,
        "POST",
        JSON.stringify({
          email: emailValue,
        }),
        { "Content-Type": "application/json" }
      );
      toast.success(
        "A Reset Password link has been sent to your Mail ID",
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
          Forget Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
          <Button
            disabled={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ my: 2 }}
          >
            {isLoading ? "Sending Rest Link..." : "Generate Reset Link"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                component="button"
                onClick={() => {
                  navigate("/");
                }}
                variant="body2"
              >
                Back to Login
              </Link>
            </Grid>
          </Grid>
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
  );
};

export default ForgetPasswordForm;
