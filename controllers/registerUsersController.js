const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const secureDATA = require("../securityHelper").encrypt_DecryptDATA;

// REGISTER
exports.registerUsers = async (req, res) => {
  try {
    const encryptedEmail = secureDATA(req.body.email, "encrypt");
    const userExist = await User.findOne({
      $or: [{ email: encryptedEmail }, { username: req.body.username }],
    });

    if (userExist) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Creating the user
    const newUser = new User({
      fullname: req.body.fullname,
      username: req.body.username,
      email: encryptedEmail,
      password: hashedPassword,
    });
    // Saving the user to the database
    const user = await newUser.save();

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
