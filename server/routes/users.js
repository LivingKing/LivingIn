const express = require("express");
const router = express.Router();
const User = require("../models/User");
const tokenGenerator = require("../libs/tokenGenerator");
const sendEmail = require("../libs/sendEmail");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const moment = require("moment");
const host = require("../config/host");
const verifyUser = require("../libs/verifyUser");

// 유저 조회 api
router.get("/", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
  } else {
    User.find({}, (err, users) => {
      if (err) throw err;
      res.json(users);
    });
  }
});

// 유저 수정 api
router.put("/", async (req, res) => {
  try {
    const result = JSON.parse(req.body.data);
    if (result.type === "profile") {
      const {
        imageUrl,
        hashTags,
        password,
        nickname,
        access_token,
        token_type,
      } = result;
      const user = await verifyUser(token_type, access_token);
      if (imageUrl) user.icon = imageUrl;
      if (hashTags) user.hashTags = hashTags;
      if (password) user.passwrod = password;
      if (nickname) user.nickname = nickname;
      user.save();
    } else {
      const { token, password } = req.body;
      const result = await jwt.verify(token, config.secret);
      const user = await User.findOneByEmail(result.email);
      user.password = password;
      user.save();
    }
    res.status(200).json({ result: "success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ result: "fail" });
  }
});

// id 찾기 api
router.get("/forgot/id", (req, res) => {
  const { name, birthday } = req.query;
  User.findOne(
    { name: name, birthday: birthday + "T00:00:00.000Z" },
    (err, user) => {
      if (err) throw err;
      res.status(200).json(user.email);
    }
  );
});

//password 찾기 api
router.get("/forgot/password", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOneByEmail(email);
    const token = await tokenGenerator(user, "1h");
    sendEmail(email, token.access_token, user.nickname, "findPw");
    res.status(200).json({ result: "success" });
  } catch (err) {
    res.status(404).json({ result: "fail" });
  }
});

// 유저 삭제 api
router.delete("/", (req, res) => {
  const { email } = req.query;
  User.remove({ email: email }, (err, result) => {
    if (err) throw err;
    res.json({
      message: "success delete",
    });
  });
});

// 로컬 유저 생성 api
router.post("/", async (req, res) => {
  try {
    const {
      email,
      password,
      nickname,
      imageUrl,
      name,
      birthday,
      hashTags,
    } = req.body;
    let user = await User.findOneByEmail(email);
    if (user) throw new Error("username exists");
    user = await User.create(
      email,
      password,
      nickname,
      imageUrl,
      name,
      moment(birthday).format("yyyy-MM-DD"),
      hashTags
    );
    jwt.sign(
      {
        email: user.email,
        password: user.password,
        nickname: user.nickname,
        name: user.name,
        birthday: user.birthday,
      },
      config.secret,
      {
        expiresIn: "1h",
        issuer: "LivingIn.com",
        subject: "userInfo",
      },
      async (err, token) => {
        if (err) throw err;
        await sendEmail(user.email, token, user.nickname, "welcome");
      }
    );
    res.status(200).json({
      message: "registered successfully",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(409).json({
      message: error.message,
      success: false,
    });
  }
});

//구글 계정 생성 api
router.post("/google", async (req, res) => {
  try {
    const { email, imageUrl, nickname } = req.body.googledata;
    const user = await User.findOneByEmail(email);
    if (user) throw new Error("username exists");
    await User.create(email, "", nickname, imageUrl);
    res.status(200).json({
      message: "registered successfully",
    });
  } catch (error) {
    const onError = (error) => {
      res.status(409).json({
        message: error.message,
      });
    };
  }
});

//카카오 계정 생성 pai
router.post("/kakao", async (req, res) => {
  try {
    const post = req.body.kakaodata;
    const email = post.profile.kakao_account.email;
    const user = await User.findOneByEmail(email);
    if (user) throw new Error("username exists");
    await User.create(
      post.profile.kakao_account.email,
      "",
      post.profile.properties.nickname,
      post.profile.properties.profile_image,
      [],
      post.profile.id
    );
    res.status(200).json({
      message: "registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
});

// 로컬 가입 승인
router.get("/confirm", async (req, res) => {
  try {
    const { token } = req.query;
    const result = await jwt.verify(token, config.secret);
    const user = await User.findOneByEmail(result.email);
    if (!user.is_active) {
      user.is_active = true;
      await user.save();
      res.redirect(`${host.clientHost()}/confirm/success`);
    } else {
      res.redirect(`${host.clientHost()}/confirm/fail`);
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const { email } = req.query;
      await User.remove({ email: email });
    }
    res.redirect(`${host.clientHost()}/confirm/fail`);
  }
});
module.exports = router;
