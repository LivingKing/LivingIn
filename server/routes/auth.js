const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");

router.post("/vaild_check", (req, res) => {
  const { email, nickname } = req.body;
  console.log(email, nickname);
  const respond = (user) => {
    if (user) {
      throw new Error("already exist");
    } else {
      res.status(200).json({ success: true });
    }
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
      success: false,
    });
  };
  if (email !== undefined)
    User.findOneByEmail(email).then(respond).catch(onError);
  else if (nickname !== undefined)
    User.findOneByNick(nickname).then(respond).catch(onError);
});

router.post("/login", (req, res) => {
  const post = req.body;
  const secret = config.secret;
  User.findOne({ email: post.email }, (err, user) => {
    if (err) throw err;
    if (user) {
      bcrypt.compare(post.password, user.password, (err, result) => {
        if (err) throw err;
        if (result) {
          return new Promise((resolve, reject) => {
            jwt.sign(
              {
                _id: user._id,
                email: user.email,
              },
              secret,
              {
                expiresIn: "5m",
                issuer: "test",
                subject: "userInfo",
              },
              (err, token) => {
                if (err) reject(err);
                else resolve(token);
              }
            );
          }).then((token) => {
            res.status(200).json({ message: "logged in successfully", token });
          });
        }
      });
    }
  });
});

router.post("/login/google", (req, res) => {
  const post = req.body.profileObj;
  User.findOne({ email: post.email }, (err, user) => {
    if (err) throw err;
    if (!user) {
      console.log("user not found!");
      return axios({
        method: "post",
        url: "http://localhost:5000/register/google",
        data: {
          googledata: post,
        },
      });
    } else {
      res.status(200).send(JSON.stringify("success"));
    }
  });
});

router.post("/login/kakao", (req, res) => {
  const post = req.body.profile;
  User.findOne({ email: post.kakao_account.email }, (err, user) => {
    if (err) throw err;
    if (!user) {
      return axios({
        method: "post",
        url: "http://localhost:5000/register/kakao",
        data: {
          kakaodata: post,
        },
      }).then(res.status(200).send(JSON.stringify("success")));
    } else {
      res.status(200).send(JSON.stringify("success"));
    }
  });
});
router.get("/login", (req, res) => {
  console.log("get");
});

module.exports = router;
