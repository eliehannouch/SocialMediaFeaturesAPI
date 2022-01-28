const express = require("express");
const router = express.Router();

const registerController = require("../controllers/registerUsersController");

router.post("/register", registerController.registerUsers);

module.exports = router;
