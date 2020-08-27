const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", (req, res) => {
  const { email, password, nickname, imageUrl } = req.body;

  const create = (user) => {
    if (user) throw new Error("username exists");
    return User.create(email, password, nickname, imageUrl);
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
    return User.create(email, "", name, imageUrl);
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

  const create = (user) => {
    if (user) throw new Error("username exists");
    return User.create(
      post.profile.kakao_account.email,
      "",
      post.profile.properties.nickname,
      post.profile.properties.profile_image,
      post.response.refresh_token
    );
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
module.exports = router;
