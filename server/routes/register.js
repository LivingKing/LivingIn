const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", (req, res) => {
  const post = req.body;
  console.log(post);
  const user = new User();
  user.email = post.email;
  user.password = post.password;
  user.nickname = post.nickname;
  user.is_admin = false;
  user.save((err) => {
    if (err) {
      console.log("err");
      return res.json({ success: false, err });
    }
    return res.status(200).send(JSON.stringify("success"));
  });
});

router.post("/google", (req, res) => {
  const post = req.body.googledata;
  const user = new User();
  user.email = post.email;
  user.googleId = post.googleId;
  user.icon = post.imageUrl;
  user.nickname = post.name;
  user.is_admin = false;
  user.save((err) => {
    if (err) {
      console.log("err");
      return res.json({ success: false, err });
    }
    return res.status(200).send(JSON.stringify("success"));
  });
});

router.post("/kakao", (req, res) => {
  const post = req.body.kakaodata;
  const user = new User();
  user.email = post.kakao_account.email;
  user.kakaoId = post.id;
  user.icon = post.kakao_account.profile.profile_image_url;
  user.nickname = post.kakao_account.profile.nickname;
  user.is_admin = false;
  user.save((err) => {
    if (err) {
      console.log("err");
      return res.json({ success: false, err });
    }
    return res.status(200).send(JSON.stringify("success"));
  });
});
module.exports = router;
