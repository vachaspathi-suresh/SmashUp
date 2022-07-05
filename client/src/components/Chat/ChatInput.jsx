import React, { useState } from "react";
import { EmojiEmotions, Send } from "@mui/icons-material";
import Picker from "emoji-picker-react";

import classes from "./ChatInput.module.css";
import "./ChatInputEmoji.css";

const ChatInput = (props) => {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      props.handleSendMsg(msg);
      setMsg("");
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.buttonContainer}>
        <div className={`${classes.emoji} emoji`}>
          <EmojiEmotions onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form
        className={classes.inputContainer}
        onSubmit={(event) => sendChat(event)}
      >
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <Send />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
