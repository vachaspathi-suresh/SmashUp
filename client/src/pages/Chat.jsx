import React, { useEffect, useState, useRef } from "react";
import { Drawer, IconButton, Container, Typography, Box } from "@mui/material";
import {
  Contacts,
  ArrowForwardIos,
  ReportGmailerrorred,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import ChatContainer from "../components/Chat/ChatContainer";
import Nav from "../components/UI/Nav";
import Friends from "../components/Chat/Friends";
import Loader from "../components/UI/Loader";
import Welcome from "../components/UI/Welcome";
import useHTTP from "../hooks/use-http";
import { userActions } from "../store/user";
import {
  getFriendsRoute,
  getMsgsRoute,
  unreadMsgsRoute,
  delMsgsRoute,
  baseRoute,
} from "../utils/APIRoutes";

import classes from "./Chat.module.css";

const Chat = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const uid = useSelector((state) => state.auth.userId);
  const socket = useRef();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const { isLoading, error, sendRequest } = useHTTP();
  const {
    isLoading: msgIsLoading,
    error: msgError,
    sendRequest: msgSendRequest,
  } = useHTTP();
  const { sendRequest: unSendRequest } = useHTTP();
  const { sendRequest: delSendRequest } = useHTTP();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (uid) {
      socket.current = io(baseRoute);
      socket.current.emit("user-add", uid);
    }
    return () => {
      socket.current.disconnect();
    };
  }, [uid, token]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const responseData = await sendRequest(getFriendsRoute, "POST", null, {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });
        const msgsData = await msgSendRequest(getMsgsRoute, "POST", null, {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });
        setFriends(
          responseData.friends.map((friend) => ({ ...friend, msgs: [] }))
        );
        msgsData.msgs.forEach((msg) => {
          setFriends((prev) => {
            return prev.map((friend) => {
              if (friend.uid === msg.from) {
                msg.msgs.forEach((data) => {
                  friend.msgs.push({ fromSelf: false, message: data });
                });
              }
              return friend;
            });
          });
        });
        dispatch(userActions.setAvatar(responseData.avatar));
        dispatch(userActions.setName(responseData.name));
        dispatch(userActions.setUsername(responseData.username));
      } catch (err) {
        console.error(err);
      }
    };
    getFriends();
  }, [dispatch, msgSendRequest, sendRequest, token, uid]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (data) => {
        setArrivalMessage({
          from: data.from,
          msg: { fromSelf: false, message: data.msg },
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (
      currentChat &&
      arrivalMessage &&
      arrivalMessage.from === currentChat.uid
    ) {
      setCurrentChat((prev) => ({
        ...prev,
        msgs: [...prev.msgs, arrivalMessage.msg],
      }));
    } else if (arrivalMessage) {
      const addUnread = async () => {
        try {
          await unSendRequest(
            unreadMsgsRoute,
            "POST",
            JSON.stringify({
              msg: arrivalMessage.msg.message,
              from: arrivalMessage.from,
            }),
            {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          );
        } catch (err) {
          console.error(err);
        }
      };
      addUnread();
      setFriends((prev) =>
        prev.map((friend) => {
          if (friend.uid === arrivalMessage.from) {
            friend.msgs.push(arrivalMessage.msg);
          }
          return friend;
        })
      );
    }
    setArrivalMessage();
  }, [arrivalMessage, currentChat, friends, token, uid, unSendRequest]);

  const addNewFriend = (user) => {
    setFriends((prev) => [...prev, user]);
  };

  const deleteFriend = (delUID) => {
    setFriends((prev) => prev.filter((friend) => friend.uid !== delUID));
    setCurrentChat();
  };

  const handleChatChange = (chat) => {
    if (currentChat) {
      setFriends((prev) =>
        prev.map((friend) => {
          if (friend.uid === currentChat.uid) {
            friend.msgs = [];
          }
          return friend;
        })
      );
    }
    setCurrentChat(chat);
    try {
      delSendRequest(
        delMsgsRoute,
        "POST",
        JSON.stringify({
          from: chat.uid,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isLoading || msgIsLoading ? (
        <Loader />
      ) : !!error || !!msgError ? (
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
            Sorry, Currently server is down
          </Typography>
          <Typography variant="body" color="white" lineHeight="2">
            Come back again later.
          </Typography>
        </Container>
      ) : (
        <>
          <Nav />
          {/* <div className={classes.box}> */}
          <Box
            sx={{
              mt: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <div className={classes.container}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                disableRipple
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  mr: 2,
                  display: { md: "none", xs: "" },
                  color: "white",
                  mt: 30,
                  mb: 30,
                }}
              >
                <Contacts
                  sx={{
                    fontSize: 40,
                    border: 7,
                    borderRadius: 5,
                    borderColor: "blueviolet",
                    backgroundColor: "blueviolet",
                  }}
                />
                <ArrowForwardIos />
              </IconButton>
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  "& .MuiDrawer-root": {
                    position: "absolute",
                  },
                  "& .MuiPaper-root": {
                    position: "absolute",
                    backgroundColor: "#080420",
                  },
                  display: { xs: "block", md: "none" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    backgroundColor: "#080420",
                    width: "50%",
                  },
                }}
              >
                <Friends
                  friends={friends}
                  allFriends={friends}
                  addFriends={addNewFriend}
                  changeChat={handleChatChange}
                />
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  "& .MuiDrawer-root": {
                    position: "absolute",
                  },
                  "& .MuiPaper-root": {
                    position: "absolute",
                    backgroundColor: "#080420",
                  },
                  display: { xs: "none", md: "block" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: "25%",
                  },
                }}
                open
              >
                <Friends
                  friends={friends}
                  addFriends={addNewFriend}
                  allFriends={friends}
                  changeChat={handleChatChange}
                />
              </Drawer>
              {currentChat === undefined ? (
                <Welcome />
              ) : (
                <ChatContainer
                  delFriend={deleteFriend}
                  currentChat={currentChat}
                  setCurrentChat={setCurrentChat}
                  socket={socket}
                />
              )}
            </div>
            {/* </div> */}
          </Box>
        </>
      )}
    </>
  );
};

export default Chat;
