import React, { useState } from "react";
import { IconButton, Avatar, Chip, Typography, Tooltip } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { useSelector } from "react-redux";

import classes from "./Friends.module.css";
import AddFriend from "./AddFriend";

const Friends = (props) => {
  const currentUserName = useSelector((state) => state.user.username);
  const currentUserAvatar = useSelector((state) => state.user.avatar);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const changeCurrentChat = (index, friend) => {
    setCurrentSelected(index);
    props.changeChat(friend);
  };
  return (
    <>
      {currentUserName && currentUserAvatar && (
        <div className={classes.container}>
          <div className={classes.currentUser}>
            <div className={classes.avatar}>
              <Avatar src={`data:image/svg+xml;base64,${currentUserAvatar}`} />
            </div>
            <div className={classes.username}>
              <h2>{currentUserName}</h2>
            </div>
            <Tooltip title="Add Friend">
              <IconButton onClick={handleClickOpen} sx={{ color: "white" }}>
                <PersonAdd />
              </IconButton>
            </Tooltip>
          </div>
          {open && (
            <AddFriend
              open={open}
              allFriends={props.allFriends}
              addNew={props.addFriends}
              handleClose={handleClose}
            />
          )}
          {props.friends.length === 0 ? (
            <Typography
              color="whitesmoke"
              variant="h6"
              component="p"
              sx={{ m: "1rem auto", fontFamily: "cursive" }}
            >
              No Friends added yet!
            </Typography>
          ) : (
            <div className={classes.friends}>
              {props.friends.map((friend, index) => {
                return (
                  <div
                    key={friend.uid}
                    className={`${classes.friend} ${
                      index === currentSelected ? classes.selected : ""
                    }`}
                    onClick={() => changeCurrentChat(index, friend)}
                  >
                    <div className={classes.avatar}>
                      <img
                        src={`data:image/svg+xml;base64,${friend.avatar}`}
                        alt={friend.name}
                      />
                    </div>
                    <div>
                      <h3>{friend.name}</h3>
                      <p>{friend.username}</p>
                    </div>
                    {index !== currentSelected && friend.msgs.length !== 0 && (
                      <Chip
                        color="secondary"
                        size="small"
                        label={friend.msgs.length}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Friends;
