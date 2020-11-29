const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

// 글 생성 api
router.post("/", async (req, res) => {
  const { title, content, access_token, token_type, tags, category } = req.body;
  let result, user;
  if (token_type === "local") {
    result = await jwt.verify(access_token, config.secret);
    user = await User.findOneByEmail(result.email);
  } else if (token_type === "kakao") {
    result = await axios({
      method: "GET",
      url: "https://kapi.kakao.com./v1/user/access_token_info",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    user = await User.findOneBySocialId(result.data.id);
  } else if (token_type === "google") {
    result = await axios({
      method: "GET",
      url: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${access_token}`,
    });
    user = await User.findOneByEmail(result.data.email);
  }
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
    let length = Number(req.query.length);
    if (!length) {
      length = 0;
    }
    const post = await Post.find()
      .sort({ created_At: -1 })
      .skip(length)
      .limit(5);
    res.status(200).json(post);
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
