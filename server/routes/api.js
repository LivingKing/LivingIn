const express = require("express");
const router = express.Router();
const User = require("../models/User");
const tokenGenerator = require("../libs/tokenGenerator");
const sendEmail = require("../libs/sendEmail");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const config = require("../config/config");

router.get("/users", (req, res) => {
  User.find({}, (err, users) => {
    if (err) throw err;
    res.json(users);
  });
});

router.get("/userinfo", async (req, res) => {
  try {
    const { access_token, type } = req.query;
    console.log(access_token, type);
    let result;
    let email;
    if (type === "local") {
      result = await jwt.verify(access_token, config.secret);
      email = result.email;
    } else if (type === "google") {
      result = await axios({
        method: "GET",
        url: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${access_token}`,
      });
      email = result.data.email;
    }

    const user = await User.findOneByEmail(email);
    console.log(user);
    res.status(200).json({ result: "success", user: user });
  } catch (err) {
    res.status(404).json({ result: "fail" });
  }
});

router.get("/forget/user", async (req, res) => {
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
router.get("/user", (req, res) => {
  const { name, birthday } = req.query;
  User.findOne(
    { name: name, birthday: birthday + "T00:00:00.000Z" },
    (err, user) => {
      if (err) throw err;
      res.status(200).json(user.email);
    }
  );
});

router.get("/delete/", (req, res) => {
  const { email } = req.query;
  User.remove({ email: email }, (err, result) => {
    if (err) throw err;
    res.json({
      message: "success delete",
    });
  });
});

router.get("/getUserIcon", async (req, res) => {
  const { nickname } = req.query;
  const user = await User.findOneByNick(nickname);
  console.log(user);
  User.findOne({ nickname: nickname }, (err, user) => {
    if (err) throw err;
    console.log(user);
    res.status(200).json(user);
  });
});

module.exports = router;
