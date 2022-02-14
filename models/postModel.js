const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    postOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", postSchema);
