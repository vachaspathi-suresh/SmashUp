import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import {
  Grid,
  Typography,
  Button,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { Autorenew } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setAvatarRoute, getAvatarsRoute } from "../../utils/APIRoutes";
import { userActions } from "../../store/user";
import useHTTP from "../../hooks/use-http";
import shuffle from "../../utils/RandomGenerator";

import classes from "./Avatar.module.css";
import Loader from "../UI/Loader";

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

const Avatar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isLoading: setLoading,
    clearError: setClearError,
    sendRequest: setSendRequest,
  } = useHTTP();
  const isLogged = useSelector((state) => state.auth.isLoggedIn);
  useEffect(() => {
    if (!isLogged) {
      navigate("/auth");
    }
  }, [isLogged, navigate]);
  const token = useSelector((state) => state.auth.token);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      try {
        const responseData = await setSendRequest(
          setAvatarRoute,
          "POST",
          JSON.stringify({
            avatar: avatars[selectedAvatar],
          }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );
        dispatch(userActions.setAvatar(responseData.avatar));
        navigate("/");
      } catch (err) {
        toast.error(err.message, {
          ...toastOptions,
          onClose: () => {
            setClearError();
          },
        });
      }
    }
  };

  useEffect(() => {
    const data = [];
    setIsLoading(true);
    const getAvatars = async () => {
      const AvatarIndexes = shuffle().slice(0, 6);
      for (let i = 0; i < 6; i++) {
        const response = await fetch(
          `${getAvatarsRoute}/${AvatarIndexes[i]}.svg`
        );
        const avatarImg = await response.text();
        const buffer = Buffer.from(avatarImg);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
    };
    try {
      getAvatars();
    } catch (err) {
      toast.error(err.message, toastOptions);
    }
    setIsLoading(false);
  }, []);

  const reload = async () => {
    const data = [];
    setIsLoading(true);
    try {
      const AvatarIndexes = shuffle().slice(0, 6);
      for (let i = 0; i < 6; i++) {
        const response = await fetch(
          `${getAvatarsRoute}/${AvatarIndexes[i]}.svg`
        );
        const avatarImg = await response.text();
        const buffer = Buffer.from(avatarImg);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
    } catch (err) {
      toast.error(err.message, toastOptions);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={classes.container}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography variant="h2" sx={{ color: "#f8ecc8", ml: 5 }}>
              Select an Avatar
            </Typography>
            <Tooltip title="Refresh Avatars">
              <IconButton onClick={reload} sx={{ m: "1rem" }}>
                <Autorenew sx={{ fontSize: "2.5rem", color: "whitesmoke" }} />
              </IconButton>
            </Tooltip>
          </Box>
          <div className={classes.avatars}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {avatars.map((avatar, index) => (
                <Grid
                  className={`${classes.avatar} ${
                    selectedAvatar === index ? classes.selected : ""
                  }`}
                  item
                  xs
                  key={index}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
          <Button variant="contained" size="large" onClick={setProfilePicture}>
            {setLoading ? "Adding Avatar..." : "Continue"}
          </Button>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default Avatar;
