const express = require("express");
const router = express.Router();

const followSystemController = require("../controllers/followSystemController");

router.put("/:id/followUnfollow", followSystemController.followUnfollow);

router.get(
  "/:userId/followers",
  followSystemController.getfollowers_followingList
);
router.get(
  "/:userId/following",
  followSystemController.getfollowers_followingList
);

module.exports = router;
