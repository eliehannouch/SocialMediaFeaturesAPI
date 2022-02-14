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

router.get(
  "/:userID/pendingRequests",
  friendRequestsController.getSent_Received_Requests
);

router.get(
  "/:userID/receivedRequests",
  friendRequestsController.getSent_Received_Requests
);

router.get("/:userID/friends", friendRequestsController.getFriendsList);

module.exports = router;
