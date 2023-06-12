const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const { PostModel } = require("../models/Posts.model");

const postRouter = express.Router();

postRouter.use(auth);

postRouter.get("/", async (req, res) => {
  try {
    const posts = await PostModel.find({ user: req.body.userId });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

postRouter.post("/create", async (req, res) => {
  try {
    const post = new PostModel(req.body);
    await post.save();
    res
      .status(201)
      .json({ msg: `post created by ${req.user}`, post: req.body });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

postRouter.patch("/update/:postid", async (req, res) => {
  //userIdInUserDoc === userIdInPostDoc
  const userIdInUserDoc = req.body.userId;
  const { postid } = req.params;
  try {
    const post = await PostModel.findOne({ _id: postid });
    const userIdInPostDoc = post.userId;
    console.log(userIdInPostDoc, userIdInUserDoc);
    if (userIdInUserDoc === userIdInPostDoc) {
      await PostModel.findByIdAndUpdate({ _id: postid }, req.body);
      res.status(202).json({ msg: `${post.title} is updated` });
    } else {
      res.json({ msg: "not Authorized" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  //userIdInUserDoc === userIdInPostDoc
  const userIdInUserDoc = req.body.userId;
  const { id } = req.params;
  try {
    const post = await PostModel.findOne({ _id: id });
    const userIdInPostDoc = post.userId;
    if (userIdInUserDoc === userIdInPostDoc) {
      await PostModel.findByIdAndDelete({ _id: id }, req.body);
      res.status(202).json({ msg: `${post.title} is deleted` });
    } else {
      res.json({ msg: "not Authorized" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = {
  postRouter,
};
