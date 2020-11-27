const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Comment = require("../models/Comment");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const axios = require("axios");
// 댓글 생성 api
router.post("/", async (req, res) => {
  const { post_id, access_token, token_type, content } = req.body;
  let result;
  let user;
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
  Comment.create(post_id, user.nickname, user.icon, content).then(() => {
    res.status(200).json({
      message: "comment successfully",
    });
  });
});

// 댓글 조회 api
router.get("/", async (req, res) => {
  const { post_id } = req.query;
  let comment;
  if (post_id) {
    comment = await Comment.findByPostId(post_id);
  } else {
    comment = await Comment.find({});
  }
  if (comment !== null) {
    return res.status(200).json(comment);
  }
});

module.exports = router;
