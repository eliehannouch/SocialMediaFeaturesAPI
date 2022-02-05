const user = require("../models/userModel");

exports.followUnfollow = async (req, res) => {
  if (req.params.id !== req.body.currentUserId) {
    try {
      // current user
      const currentUser = await user.findById(req.body.currentUserId);
      if (!currentUser)
        return res.status(400).json("Please login to perform this action");

      // user to be followed
      const userToBeFollowed = await user.findById(req.params.id);
      if (!userToBeFollowed)
        return res.status(404).json("The user does not exist");

      if (!userToBeFollowed.followers.includes(req.body.currentUserId)) {
        // update the user to be followed
        await userToBeFollowed.updateOne({
          $push: { followers: req.body.currentUserId },
        });

        // update the current user
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("You are now following this user");
      } else {
        await userToBeFollowed.updateOne({
          $pull: { followers: req.body.currentUserId },
        });

        await currentUser.updateOne({ $pull: { following: req.params.id } });

        return res.status(200).json("user has been unfollowed");
      }
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  } else {
    return res
      .status(409)
      .json({ message: "You cannot follow/unfollow yourself" });
  }
};

exports.getfollowers_followingList = async (req, res) => {
  try {
    const choosenPath = req.path.split("/")[2];
    const currentUser = await user.findById(req.params.userId);

    if (!currentUser)
      return res
        .status(400)
        .json({ message: `Please log in to access the ${choosenPath} list` });

    const result = await currentUser.populate({
      path: choosenPath,
      select: { fullname: 1, username: 1, email: 1, profilePicture: 1 },
    });

    return res.status(200).json({
      message: `The ${choosenPath} list: `,
      [choosenPath]: result._doc[choosenPath],
    });

    // switch (true) {
    //   case choosenPath === "followers":
    //     return res.status(200).json({
    //       message: "Your followers are:",
    //       followers: result._doc.followers,
    //     });
    //   case choosenPath === "following":
    //     return res.status(200).json({
    //       message: "Your are following:",
    //       following: result._doc.following,
    //     });
    // }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
