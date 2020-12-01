const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const verifyUser = require("../libs/verifyUser");

// 글 생성 api
router.post("/", async (req, res) => {
  const { title, content, access_token, token_type, tags, category } = req.body;
  const user = await verifyUser(token_type, access_token);
  Post.create(title, content, user.nickname, tags, category).then(() => {
    res.status(200).json({
      message: "post successfully",
    });
  });
});

// 글 조회 api
router.get("/", async (req, res) => {
  try {
    if (Object.keys(req.query).length !== 0) {
      const { id } = req.query;
      if (id) {
        const post = await Post.findById(id);
        if (post) {
          post.hits = post.hits + 1;
          post.save();
          return res.status(200).json(post);
        }
      }
      const { category } = req.query;
      if (category) {
        const post = await Post.find({ category: category }).sort({ hits: -1 });
        return res.status(200).json(post);
      }
      let length = Number(req.query.length);
      let sort_type = req.query.sort_type;
      if (!length) {
        length = 0;
      }
      if (!sort_type) {
        sort_type = "created_At";
      }
      let obj = {};
      obj[sort_type] = -1;
      const post = await Post.find().sort(obj).skip(length).limit(5);
      return res.status(200).json(post);
    } else {
      const post = await Post.find().sort({ created_At: -1 }).limit(5);
      return res.status(200).json(post);
    }
  } catch (err) {
    console.log(err);
  }
});

//글 수정 api
router.put("/", async (req, res) => {
  const { title, content, writer, tags, category } = req.body;
});

//글 삭제 api
router.delete("/", async (req, res) => {
  const { id, access_token } = req.query;
});

module.exports = router;
