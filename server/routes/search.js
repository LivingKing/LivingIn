const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/posts", async (req, res) => {
  const { title } = req.query;
  if (title) {
    Post.find({ title: { $regex: title } }, (err, post) => {
      if (err) throw err;
      res.status(200).json(post);
    }).sort({ created_At: -1 });
  }
  const { writer } = req.query;
  if (writer) {
    Post.find({ writer: { $regex: writer } }, (err, post) => {
      if (err) throw err;
      res.status(200).json(post);
    }).sort({ created_At: -1 });
  }
  const { value } = req.query;
  if (value) {
    Post.find(
      { $or: [{ title: { $regex: value } }, { writer: { $regex: value } }] },
      (err, post) => {
        if (err) throw err;
        res.status(200).json(post);
      }
    ).sort({ created_At: -1 });
  }
});

module.exports = router;
