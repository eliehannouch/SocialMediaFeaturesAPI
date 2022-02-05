const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendRequestSchema = new mongoose.Schema(
  {
    senderID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    requestStatus: {
      type: String,
      default: "",
      enum: ["pending", "accepted", "cancelled", "declined"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
