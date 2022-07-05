require("dotenv").config();

const userRoutes = require("./routes/user-routes");
const msgRoutes = require("./routes/msg-routes");
const HttpError = require("./models/http-error");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const socket = require("socket.io");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/res/avatar", express.static(path.join("res", "avatars")));
app.use("/api/auth", userRoutes);
app.use("/api/msg", msgRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    const server = app.listen(process.env.PORT || 5000, () => {
      console.log("Server is up and listening");
    });
    const io = socket(server, {
      cors: {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
      },
    });

    global.onlineUsers = new Map();
    io.on("connection", (socket) => {
      global.chatSocket = socket;
      socket.on("user-add", (userId) => {
        onlineUsers.set(userId, socket.id);
      });

      socket.on("msg-send", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket
            .to(sendUserSocket)
            .emit("msg-receive", { msg: data.msg, from: data.from });
        }
      });
      socket.on("disconnect", () => {
        let disId;
        for (const [key, value] of onlineUsers.entries()) {
          if (value === socket.id) {
            disId = key;
            break;
          }
        }
        if (disId && disId !== "") {
          onlineUsers.delete(disId);
        }
      });
    });
  })
  .catch((err) => {
    console.log("ERROR_CONNECTING_DATABASE  ", err);
  });
