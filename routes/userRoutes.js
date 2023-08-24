const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel");
require("dotenv").config();
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(201).json({ msg: "User Already Present" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (hash) {
          await UserModel({ ...req.body, password: hash }).save();
          return res
            .status(200)
            .json({ msg: "New User Created Successull", user: req.body });
        } else {
          return res.status(500).json({ error: err.message });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User Not Found....!" });
    } else {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          var token = jwt.sign(
            { userID: user._id, username: user.username },
            process.env.secrate
          );
          return res.status(200).json({ msg: "Login Successfull", token });
        } else {
          return res.status(404).json({ msg: "Wrong Password" });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = userRouter;
