const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "544956299484-cb4buam4sdchdl5t28h7cmvq41hc99uq.apps.googleusercontent.com"
);

router.post("/vaild_check", (req, res) => {
  const { email, nickname } = req.body;
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

router.post("/token_check", (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({ success: false, message: "not logged in" });
  }

  const p = new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };

  p.then((decoded) => {
    req.decoded = decoded;
    res.status(200).json({ success: true });
  }).catch(onError);
});

router.post("/google/token_check", (req, res) => {
  const token_id = req.headers["x-access-token"];
  const verify = () => {
    return client.verifyIdToken({
      idToken: token_id,
      audience:
        "544956299484-cb4buam4sdchdl5t28h7cmvq41hc99uq.apps.googleusercontent.com",
    });
  };

  const respond = () => res.status(200).json({ success: true });
  verify().then(respond).catch(console.error);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const secret = config.secret;

  const check = (user) => {
    if (!user) {
      throw new Error("user not exist");
    } else {
      return user.verify(password).then((result) => {
        if (result) {
          return new Promise((resolve, reject) => {
            jwt.sign(
              {
                _id: user._id,
                email: user.email,
                admin: user.is_admin,
              },
              secret,
              {
                expiresIn: "1h",
                issuer: "LivingIn.com",
                subject: "userInfo",
              },
              (err, token) => {
                if (err) reject(err);
                else resolve({ access_token: token, nickname: user.nickname });
              }
            );
          });
        } else throw new Error("password incorrect");
      });
    }
  };
  const respond = (result) => {
    const { access_token, nickname } = result;
    res.status(200).json({
      message: "logged in successfully",
      nickname,
      access_token,
    });
  };
  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  User.findOneByEmail(email).then(check).then(respond).catch(onError);
});

router.post("/login/google", (req, res) => {
  const { email } = req.body.profileObj;
  const check = (user) => {
    if (!user) {
      console.log("user not found!");
      return axios({
        method: "post",
        url: "http://localhost:5000/register/google",
        data: {
          googledata: post,
        },
      });
    }
    return {
      nickname: req.body.profileObj.name,
      access_token: req.body.tokenObj.id_token,
    };
  };
  const respond = (result) => {
    const { access_token, nickname } = result;
    res.status(200).json({
      message: "logged in successfully",
      access_token,
      nickname,
    });
  };
  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  User.findOneByEmail(email).then(check).then(respond).catch(onError);
});

router.post("/login/kakao", (req, res) => {
  const email = req.body.profile.kakao_account.email;

  const check = (user) => {
    if (!user) {
      console.log("user not found!");
      return axios({
        method: "post",
        url: "http://localhost:5000/register/kakao",
        data: {
          nickname,
          kakaodata: req.body,
        },
      });
    }
    return {
      nickname: req.body.profile.properties.nickname,
      access_token: req.body.response.refresh_token.access_token,
    };
  };
  const respond = (result) => {
    const { access_token, nickname } = result;
    res.status(200).json({
      message: "logged in successfully",
      nickname,
      access_token,
    });
  };
  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  User.findOneByEmail(email).then(check).then(respond).catch(onError);
});

module.exports = router;
