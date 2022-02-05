const User = require("../models/userModel");
const FriendRequest = require("../models/requestModel");
const actions = require("../actions");

const checkExistingFriendRequest = async (req, status) => {
  try {
    const checkExistence = await FriendRequest.find({
      $and: [
        {
          $and: [
            { senderID: req.body.senderID },
            { receiverID: req.body.receiverID },
          ],
        },
        { requestStatus: { $eq: status } },
      ],
    });
    if (checkExistence.length == 0) return false;
    return true;
  } catch (err) {
    console.log(err);
  }
};

const checkRequestBasedOnStatus = async (req, status) => {
  try {
    const request = await FriendRequest.findOne({
      $and: [{ _id: req.params.requestID }, { requestStatus: { $eq: status } }],
    });

    if (request) return request;
    return null;
  } catch (err) {
    console.log(err);
  }
};

const limitRequests = async (req, status) => {
  try {
    const requests = await FriendRequest.countDocuments({
      $and: [
        { senderID: req.body.senderID },
        { requestStatus: { $eq: status } },
      ],
    });

    if (requests >= 3) return true;
    return false;
  } catch (err) {
    console.log(err);
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    // 1 - check if the sender and the receiver exist
    const sender = await User.findById(req.body.senderID);
    const receiver = await User.findById(req.body.receiverID);

    if (!sender || !receiver) {
      return res
        .status(404)
        .json({ message: "Both sender and receiver must exist" });
    }

    // check if the receiver exist in our friends list
    const friendList = sender.friends.includes(req.body.receiverID);
    if (friendList) {
      return res.status(409).json({
        message: `You are already a friend with ${receiver.fullname}`,
      });
    }

    // limit sender requests
    const test = await limitRequests(req, "declined");
    if (test) {
      return res
        .status(429)
        .json({ message: "You cannot send any new request" });
    }

    // 2 - check if the request is pending
    const friendRequest = await checkExistingFriendRequest(req, "pending");
    if (friendRequest) {
      return res.status(409).json({ message: "Request already sent" });
    } else {
      // 3- create the new request
      const newFriendRequest = await FriendRequest.create({
        senderID: req.body.senderID,
        receiverID: req.body.receiverID,
        requestStatus: "pending",
      });

      return res.status(201).json({
        message: "Friend Request sent successfully",
        data: newFriendRequest,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.cancel_declineFriendRequest = async (req, res) => {
  try {
    const choosenPath = req.path.split("/")[3];

    // 1 check if the requestDocument exist
    const request = await checkRequestBasedOnStatus(req, "pending");
    if (!request) {
      return res.status(404).json({ message: "The request is not found." });
    }

    if (
      choosenPath === actions.cancel &&
      request.senderID.toString() === req.body.currentUserID.toString()
    ) {
      request.requestStatus = "cancelled";
      await request.save();
      return res
        .status(200)
        .json({ message: "Your request has been cancelled." });
    } else if (
      choosenPath === actions.decline &&
      request.receiverID.toString() === req.body.currentUserID.toString()
    ) {
      request.requestStatus = "declined";
      await request.save();
      return res.status(200).json({ message: "The request has been declined" });
    }
    return res.status(401).json({
      message: `You dont have permission to ${choosenPath} the request`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const choosenPath = req.path.split("/")[3];
    const request = await checkRequestBasedOnStatus(req, "pending");
    if (!request) {
      return res.status(404).json({ message: "The request is not found." });
    }

    const senderID = request.senderID;
    const receiverID = request.receiverID;

    if (
      choosenPath === actions.accept &&
      receiverID.toString() === req.body.currentUserID.toString()
    ) {
      request.requestStatus = "accepted";
      await request.save();
      const sender = await User.findByIdAndUpdate(
        senderID,
        { $push: { friends: receiverID } },
        { new: true }
      );
      if (!sender)
        return res.status(404).json({ message: "Sender does not exist" });

      const receiver = await User.findByIdAndUpdate(
        { _id: receiverID },
        { $push: { friends: senderID } },
        { new: true }
      );
      if (!receiver)
        return res.status(404).json({ message: "Receiver does not exist" });

      return res
        .status(200)
        .json({ message: "FriendRequest has been accepted" });
    }
    return res
      .status(401)
      .json("You dont have a permission to accept this request");
  } catch (err) {
    console.log(err);
  }
};

// TODO: Get Friends List , Get the Received and sent requests
