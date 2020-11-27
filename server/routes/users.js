const express = require("express");
const router = express.Router();
const User = require("../models/User");
const tokenGenerator = require("../libs/tokenGenerator");
const sendEmail = require("../libs/sendEmail");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

// 유저 조회 api
router.get("/", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    console.log(req.query.length);
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
    const { token, password } = req.body;
    const result = await jwt.verify(token, config.secret);
    const user = await User.findOneByEmail(result.email);
    user.password = password;
    user.save();
    res.status(200).json({ result: "success" });
  } catch (err) {
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
router.post("/", (req, res) => {
  const {
    email,
    password,
    nickname,
    imageUrl,
    name,
    birthday,
    hashTags,
  } = req.body;
  console.log(hashTags);
  const create = (user) => {
    if (user) throw new Error("username exists");
    return User.create(
      email,
      password,
      nickname,
      imageUrl,
      name,
      moment(birthday).format("yyyy-MM-DD"),
      hashTags
    );
  };
  const respond = (user) => {
    jwt.sign(
      {
        email: user.email,
        password: user.password,
        nickname: user.nickanme,
        name: user.name,
        birthday: user.birthday,
      },
      config.secret,
      {
        expiresIn: "1h",
        issuer: "LivingIn.com",
        subject: "userInfo",
      },
      (err, token) => {
        if (err) throw err;
        sendMail(user.email, token, user.nickname, "welcome");
        res.status(200).json({
          message: "registered successfully",
          success: true,
        });
      }
    );
  };

  const onError = (error) => {
    console.log(error.message);
    res.status(409).json({
      message: error.message,
      success: false,
    });
  };

  User.findOneByEmail(email).then(create).then(respond).catch(onError);
});

//구글 계정 생성 api
router.post("/google", (req, res) => {
  const { email, imageUrl, nickname } = req.body.googledata;
  const create = (user) => {
    if (user) throw new Error("username exists");
    return User.create(email, "", nickname, imageUrl);
  };

  const respond = () => {
    res.status(200).json({
      message: "registered successfully",
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  User.findOneByEmail(email).then(create).then(respond).catch(onError);
});

//카카오 계정 생성 pai
router.post("/kakao", (req, res) => {
  const post = req.body.kakaodata;
  const email = post.profile.kakao_account.email;
  const create = (user) => {
    if (user) throw new Error("username exists");
    return User.create(
      post.profile.kakao_account.email,
      "",
      post.profile.properties.nickname,
      post.profile.properties.profile_image,
      [],
      post.profile.id
    );
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
    });
  };

  User.findOneByEmail(email).then(create).then(respond).catch(onError);
});

// 로컬 가입 승인
router.put("/confirm", async (req, res) => {
  try {
    const { token } = req.query;
    const result = await jwt.verify(token, config.secret);
    const user = await User.findOneByEmail(result.email);
    if (!user.is_active) {
      user.is_active = true;
      await user.save();
      res.redirect("http://localhost:3000/confirm/success");
    } else {
      res.redirect("http://localhost:3000/confirm/fail");
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const { email } = req.query;
      await User.remove({ email: email });
    }
    res.redirect("http://localhost:3000/confirm/fail");
  }
});
module.exports = router;
