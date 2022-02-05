const express = require("express");
const router = express.Router();

const friendRequestsController = require("../controllers/requestSystemController");

router.post("/requestfriendship", friendRequestsController.sendFriendRequest);

router.patch(
  "/friendRequests/:requestID/cancel",
  friendRequestsController.cancel_declineFriendRequest
);
router.patch(
  "/friendRequests/:requestID/decline",
  friendRequestsController.cancel_declineFriendRequest
);

router.patch(
  "/friendRequests/:requestID/accept",
  friendRequestsController.acceptFriendRequest
);

module.exports = router;
