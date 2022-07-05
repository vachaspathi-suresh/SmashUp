import React, { useState } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { delAccountRoute } from "../../utils/APIRoutes";
import ConfirmDialog from "./ConfirmDialog";
import useHTTP from "../../hooks/use-http";
import ChangePassword from "../Auth/ChangePassword";

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

const Nav = () => {
  const navigate = useNavigate();
  const currentName = useSelector((state) => state.user.name);
  const currentUserAvatar = useSelector((state) => state.user.avatar);
  const currentUserName = useSelector((state) => state.user.username);
  const isLogged = useSelector((state) => state.auth.isLoggedIn);
  const logout = useSelector((state) => state.auth.logout);
  const token = useSelector((state) => state.auth.token);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [changePassDialogOpen, setChangePassDialogOpen] = useState(false);
  const [delDialogOpen, setDelDialogOpen] = useState(false);
  const { clearError: delClearError, sendRequest: delSendRequest } = useHTTP();

  const handleDelDialogClose = () => {
    setDelDialogOpen(false);
    setAnchorElUser(null);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
    setAnchorElUser(null);
  };

  const handleChangePassDialogClose = () => {
    setChangePassDialogOpen(false);
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const delAccount = async () => {
    try {
      await delSendRequest(delAccountRoute, "POST", null, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });
      handleDelDialogClose();
      logout();
      toast.success(
        `Your Account '${currentUserName}' is Deleted Successfully!!`,
        toastOptions
      );
    } catch (err) {
      toast.error(err.message, {
        ...toastOptions,
        onClose: () => {
          delClearError();
        },
      });
    }
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#330165",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar
              alt="Smash UP"
              src="/SmashUpLogo.png"
              sx={{
                width: 48,
                height: 48,
                display: { xs: "flex" },
                mr: 1,
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/");
              }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "flex" },
                flexGrow: 1,
                fontFamily: "cursive",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/");
              }}
            >
              SmashUP
            </Typography>

            {isLogged && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={currentName}
                      src={`data:image/svg+xml;base64,${currentUserAvatar}`}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/avatar");
                    }}
                  >
                    <Typography textAlign="center">Change Avatar</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setChangePassDialogOpen(true);
                    }}
                  >
                    <Typography textAlign="center">Change Password</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setDelDialogOpen(true);
                    }}
                  >
                    <Typography textAlign="center">Delete Account</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setLogoutDialogOpen(true);
                    }}
                  >
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {changePassDialogOpen && (
        <ChangePassword
          open={changePassDialogOpen}
          handleClose={handleChangePassDialogClose}
        />
      )}
      {logoutDialogOpen && (
        <ConfirmDialog
          title="Logout"
          desc="Logout from your Account"
          open={logoutDialogOpen}
          handleClose={handleLogoutDialogClose}
          onConfirm={logout}
        />
      )}
      {delDialogOpen && (
        <ConfirmDialog
          title="Delete Account"
          desc="Delete your Account, All your DATA will be lost"
          open={delDialogOpen}
          handleClose={handleDelDialogClose}
          onConfirm={delAccount}
        />
      )}
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
    </>
  );
};

export default Nav;
