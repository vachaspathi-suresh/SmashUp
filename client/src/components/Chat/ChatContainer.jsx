import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ChatInput from "./ChatInput";
import useHTTP from "../../hooks/use-http";
import { delFriendRoute, addMsgRoute } from "../../utils/APIRoutes";
import ConfirmDialog from "../UI/ConfirmDialog";

import classes from "./ChatContainer.module.css";

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

const ChatContainer = (props) => {
  const scrollRef = useRef();
  const { socket, currentChat } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    isLoading: delIsLoading,
    clearError: delClearError,
    sendRequest: delSendRequest,
  } = useHTTP();
  const { sendRequest: addSendRequest } = useHTTP();
  const token = useSelector((state) => state.auth.token);
  const uid = useSelector((state) => state.auth.userId);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSendMsg = async (msg) => {
    try {
      socket.current.emit("msg-send", {
        to: currentChat.uid,
        from: uid,
        msg,
      });
      await addSendRequest(
        addMsgRoute,
        "POST",
        JSON.stringify({
          msg,
          toUsers: [currentChat.uid],
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );

      props.setCurrentChat((prev) => ({
        ...prev,
        msgs: [...prev.msgs, { fromSelf: true, message: msg }],
      }));
    } catch (err) {
      toast.error(err.message, toastOptions);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat]);

  const unFriend = async () => {
    try {
      const responseData = await delSendRequest(
        delFriendRoute,
        "POST",
        JSON.stringify({
          friendID: currentChat.uid,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      props.delFriend(responseData.friend);
      toast.success(
        `${currentChat.username} is Removed from Friends List`,
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
      {delIsLoading ? (
        <h3
          style={{
            color: "whitesmoke",
            margin: "2rem",
            fontSize: "2rem",
            fontFamily: "cursive",
          }}
        >
          Removing...
        </h3>
      ) : (
        <div className={classes.container}>
          <div className={classes.chatHeader}>
            <div className={classes.userDetails}>
              <div className={classes.avatar}>
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatar}`}
                  alt="avatar"
                />
              </div>
              <div className={classes.username}>
                <h3>{currentChat.username}</h3>
              </div>
              <IconButton onClick={handleClick} sx={{ color: "white" }}>
                <MoreVert />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {open && (
                  <MenuItem
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                  >
                    Unfriend User
                  </MenuItem>
                )}
              </Menu>
            </div>
          </div>
          {dialogOpen && (
            <ConfirmDialog
              title="Unfriend User"
              desc={`remove ${currentChat.username} from your friends list`}
              open={dialogOpen}
              handleClose={handleDialogClose}
              onConfirm={unFriend}
            />
          )}
          <div className={classes.chatMessages}>
            {currentChat.msgs.map((message) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`${classes.message} ${
                      message.fromSelf ? classes.sended : classes.received
                    }`}
                  >
                    <div className={classes.content}>
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
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
        </div>
      )}
    </>
  );
};

export default ChatContainer;
