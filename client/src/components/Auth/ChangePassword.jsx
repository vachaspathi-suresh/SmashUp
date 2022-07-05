import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useInput from "../../hooks/use-input";
import useHTTP from "../../hooks/use-http";
import { changePasswordRoute } from "../../utils/APIRoutes";

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

const ChangePassword = (props) => {
  const [isShowPassword, setShowPassword] = useState(false);
  const [isShowNPassword, setShowNPassword] = useState(false);

  const { isLoading, clearError, sendRequest } = useHTTP();
  const token = useSelector((state) => state.auth.token);
  const logout = useSelector((state) => state.auth.logout);

  const {
    value: curPassValue,
    isValid: curPassIsValid,
    hasError: curPassHasError,
    valueChangeHandler: curPassChangeHandler,
    onBlurHandler: curPassBlurHandler,
  } = useInput((value) => value.length > 7);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!curPassIsValid || !nPassIsValid || !cpassIsValid) {
      curPassBlurHandler();
      nPassBlurHandler();
      cpassBlurHandler();
      return;
    }

    const data = new FormData(event.currentTarget);
    try {
      await sendRequest(
        changePasswordRoute,
        "POST",
        JSON.stringify({
          currPassword: data.get("current-password"),
          newPassword: data.get("confirm-password"),
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      logout();
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
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            label="Current Password"
            type={isShowPassword ? "text" : "password"}
            required
            fullWidth
            autoComplete="current-password"
            id="current-password"
            name="current-password"
            margin="normal"
            value={curPassValue}
            onChange={curPassChangeHandler}
            onBlur={curPassBlurHandler}
            error={curPassHasError}
            helperText={
              curPassHasError && "Password should contain at least 8 characters"
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowPassword((prev) => !prev);
                    }}
                    edge="end"
                  >
                    {isShowPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
              nPassHasError && "Password should contain at least 8 characters"
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
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </Box>
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
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
