const HttpError = require("../models/http-error");
const Message = require("../models/msg-model");
const User = require("../models/user-model");

const { validationResult } = require("express-validator");

const addMsg = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  if (onlineUsers.get(req.body.toUsers[0])) {
    res.json({ online: true });
  } else {
    let user;
    try {
      user = await User.findById(req.userData.userID);
    } catch (err) {
      return next(
        new HttpError("Unable to send message, please try again later.", 500)
      );
    }
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    const newMsg = new Message({
      msg: req.body.msg,
      to: [],
      from: user,
    });

    try {
      for (let i = 0; i < req.body.toUsers.length; i++) {
        const toUser = await User.findById(req.body.toUsers[i]);
        if (!toUser) {
          return next(new HttpError("ToUser not found", 422));
        }
        if (user.friends.includes(toUser._id)) {
          newMsg.to.push(toUser);
          toUser.unread.push(newMsg);
          await toUser.save();
        }
      }
      if (newMsg.to.length !== 0) {
        await newMsg.save();
      } else {
        return next(new HttpError("User is not a friend", 404));
      }
    } catch (err) {
      return next(
        new HttpError("Unable to send message, please try again later.", 500)
      );
    }
    res.json({ msg: newMsg.msg });
  }
};

const getMsgs = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userID).populate("unread");
  } catch (err) {
    return next(
      new HttpError("Unable to get message, please try again later.", 500)
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  let msgs = [];
  try {
    user.unread.map(async (msg) => {
      msg = msg.toObject({ getters: true });
      let isAdded = false;
      msgs.forEach((u) => {
        if (u?.from === msg.from._id.toString()) {
          u.msgs.push(msg.msg);
          isAdded = true;
        }
      });
      if (!isAdded) {
        msgs.push({
          from: msg.from._id.toString(),
          msgs: [msg.msg],
        });
      }
    });
    res.json({ msgs });
  } catch (err) {
    return next(
      new HttpError("Unable to get message, please try again later.", 500)
    );
  }
};

const removeUnreadMsgs = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userID).populate("unread");
  } catch (err) {
    return next(
      new HttpError("Unable to remove messages, please try again later.", 500)
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  try {
    const toDelMsgs = user.unread.filter(
      (u) => u.from._id.toString() === req.body.from
    );
    toDelMsgs.forEach(async (msg) => {
      const message = await Message.findByIdAndUpdate(
        msg._id.toString(),
        { $pull: { to: { $in: [user.id] } } },
        { new: true }
      );
      if (message.to.length === 0) {
        await Message.findByIdAndDelete(msg.id, () => {}).clone();
      }
    });
    user.unread = user.unread.filter(
      (u) => u.from._id.toString() !== req.body.from
    );
    user.save();
    res.json({ from: req.body.from });
  } catch (err) {
    return next(
      new HttpError("Unable to remove messages, please try again later.", 500)
    );
  }
};

const addUnreadMsgs = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let user;
  try {
    user = await User.findById(req.userData.userID);
  } catch (err) {
    const error = new HttpError(
      "Unable to store message, please try again later.",
      500
    );
    return next(error);
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  const newMsg = new Message({
    msg: req.body.msg,
    to: [user],
    from: null,
  });

  try {
    const fromUser = await User.findById(req.body.from);
    if (!fromUser) {
      return next(new HttpError("fromUser not found", 422));
    }
    if (user.friends.includes(fromUser._id)) {
      newMsg.from = fromUser;
      user.unread.push(newMsg);
      await user.save();
      await newMsg.save();
    } else {
      return next(new HttpError("User is not a friend", 404));
    }
  } catch (err) {
    return next(
      new HttpError("Unable to store message, please try again later.", 500)
    );
  }
  res.json({ msg: newMsg.msg });
};

exports.addMsg = addMsg;
exports.getMsgs = getMsgs;
exports.removeUnreadMsgs = removeUnreadMsgs;
exports.addUnreadMsgs = addUnreadMsgs;
