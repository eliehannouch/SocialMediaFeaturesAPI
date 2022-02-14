const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    commentOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    parentPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    commentContent: {
      type: String,
      maxLength: 255,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
