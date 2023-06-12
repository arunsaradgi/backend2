const express = require("express");
const mongoose = require("mongoose");
const { UserModel } = require("../models/Users.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.post(`/register`, async (req, res) => {
  const { name, age, email, gender, city, password, is_married } = req.body;
  try {
    const registereduser = await UserModel.findOne({
      name,
      age,
      gender,
      city,
      email,
      is_married,
    });
    if (registereduser) {
      res.status(502).json({ msg: "User is already registered. Please login" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        // Store hash in your password DB.
        if (err) {
          res.status(401).json({ msg: err.message });
        } else {
          const user = new UserModel({
            name,
            email,
            gender,
            password: hash,
            age,
            city,
            is_married,
          });
          await user.save();
          res
            .status(201)
            .json({ msg: "User registered successfully", user: req.body });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        // result == true
        if (result) {
          let token = jwt.sign(
            { userId: user._id, user: user.name },
            "fullstack"
          );
          res.status(200).json({ msg: "logged in", token });
        } else {
          res.status(502).json({ msg: "invalid creds" });
        }
      });
    } else {
      res.status(404).json({ msg: "user does not exist!!" });
    }
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

module.exports = {
  userRouter,
};
