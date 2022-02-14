const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.createPost = async (req, res) => {
  try {
    const postOwner = await User.findById(req.body["postOwner"]);

    if (!postOwner)
      return res
        .status(401)
        .json({ message: "Please log in to create a new post" });

    const newPost = await Post.create({
      postOwner: req.body["postOwner"],
      img: req.body["img"],
      content: req.body["content"],
    });

    return res.status(201).json({ data: newPost });
  } catch (err) {
    console.log(err);
  }
};

exports.like = async (req, res) => {
  try {
    const post = await Post.findById(req.params["postID"]);
    if (!post) return res.status(404).json({ message: "No post found" });

    if (!post.likes.includes(req.body["userID"])) {
      await post.updateOne({ $push: { likes: req.body["userID"] } });
      return res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body["userID"] } });
      return res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.fetchTimelinePosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.body["currentUserID"]);
    if (!currentUser)
      return res.status(401).json({ message: "Please login to get access" });

    const currentUserPosts = await Post.find({ postOwner: currentUser._id });

    const friendsPosts = await Promise.all(
      currentUser.friends.map((friendID) => {
        return Post.find({ postOwner: friendID });
      })
    );
    const timelinePosts = currentUserPosts.concat(...friendsPosts);

    return timelinePosts.length <= 0
      ? res.status(404).json({ message: "There is no posts to be displayed" })
      : res.status(200).json(timelinePosts);
  } catch (err) {
    console.log(err);
  }
};
