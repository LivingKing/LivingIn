const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

// 글 생성 api
router.post("/", async (req, res) => {
  console.log(req.body);
  const { title, content, access_token, tags, category } = req.body;
  const user = User.findOneByToken(access_token);
  Post.create(title, content, user.nickname, tags, category).then(() => {
    res.status(200).json({
      message: "post successfully",
    });
  });
});

// 글 조회 api
router.get("/", async (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    const { id } = req.query;
    if (id) {
      const post = await Post.findById(id);
      if (post) {
        post.hits = post.hits + 1;
        post.save();
        res.status(200).json(post);
      }
    }
    const { category } = req.query;
    if (category) {
      Post.find({ category: category }, (err, post) => {
        if (err) throw err;
        res.status(200).json(post);
      }).sort({ hits: -1 });
    }
  } else {
    Post.find({}, (err, post) => {
      if (err) throw err;
      res.status(200).json(post);
    })
      .sort({ created_At: -1 })
      .limit(5);
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
