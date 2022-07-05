const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
  msg: {
    type: String,
    required: true,
  },
  to: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
  from: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Message", msgSchema);
