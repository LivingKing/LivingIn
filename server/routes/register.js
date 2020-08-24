const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", (req, res) => {
  const { email, password, nickname } = req.body;

  const create = (user) => {
    if (user) throw new Error("username exists");
    return User.create(email, password, nickname);
  };
  const respond = () => {
    res.status(200).json({
      message: "registered successfully",
      success: true,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
      success: false,
    });
  };

  User.findOneByEmail(email).then(create).then(respond).catch(onError);
});

router.post("/google", (req, res) => {
  const { email, googleId, imageUrl, name } = req.body.googledata;
  const create = (user) => {
    if (user) throw new Error("username exists");
    return User.create(email, "", imageUrl, name, googleId);
  };

  const respond = (is_admin) => {
    res.status(200).json({
      message: "registered successfully",
      admin: is_admin ? true : false,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  User.findOneByEmail(email).then(create).then(respond).catch(onError);
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
