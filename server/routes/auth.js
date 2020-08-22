const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");

router.post("/login", (req, res) => {
  const post = req.body;
  console.log(post);
  res.status(200).send(JSON.stringify("success"));
});

router.post("/login/google", (req, res) => {
  const post = req.body.profileObj;
  User.findOne({ email: post.email }, (err, user) => {
    if (err) throw err;
    if (!user) {
      return axios({
        method: "post",
        url: "http://localhost:5000/register/google",
        data: {
          googledata: post,
        },
      }).then(res.status(200).send(JSON.stringify("success")));
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
