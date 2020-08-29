const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(config.google_clientID);
const qs = require("querystring");

const tokenGenerator = (user, time) => {
  const secret = config.secret;
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        _id: user._id,
        email: user.email,
        admin: user.is_admin,
      },
      secret,
      {
        expiresIn: time,
        issuer: "LivingIn.com",
        subject: "userInfo",
      },
      (err, token) => {
        if (err) reject(err);
        else
          resolve({
            access_token: token,
            nickname: user.nickname,
          });
      }
    );
  });
};
const token_exp = "1h";

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
      const exp = decoded.exp * 1000 - new Date().getTime();
      if (exp <= 600000) {
        //10분
        User.findOneByEmail(decoded.email).then((user) => {
          jwt.verify(user.refresh_token, config.secret, (err) => {
            if (err) reject(err);
            tokenGenerator(user, token_exp).then((result) => {
              resolve(result);
            });
          });
        });
      } else {
        resolve("");
      }
    });
  });

  const respond = (result) => {
    res.status(200).json({ success: true, result });
  };

  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };

  p.then(respond).catch(onError);
});

router.post("/google/token_check", (req, res) => {
  const token_id = req.headers["x-access-token"];
  const verify = () => {
    return client.verifyIdToken({
      idToken: token_id,
      audience: config.google_clientID,
    });
  };

  const respond = () => res.status(200).json({ success: true });
  verify().then(respond).catch(console.error);
});

router.post("/kakao/token_check", (req, res) => {
  const access_token = req.headers["x-access-token"];
  const check_token = () => {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        url: "https://kapi.kakao.com./v1/user/access_token_info",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }).then((res, err) => {
        if (err) reject(err);
        if (res.data.expiresInMillis <= 600000) {
          User.findOneBySocialId(res.data.id).then((user) => resolve(user));
        } else resolve({ success: true });
      });
    });
  };

  const get_token = (res) => {
    return new Promise((resolve, reject) => {
      if (res._id !== undefined) {
        const data = {
          grant_type: "refresh_token",
          client_id: config.kakao_REST_API_KEY,
          refresh_token: res.refresh_token,
        };
        axios({
          method: "POST",
          url: "https://kauth.kakao.com/oauth/token",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
          data: qs.stringify(data),
        }).then((res, err) => {
          if (err) reject(err);
          const { access_token, refresh_token } = res.data;
          if (refresh_token !== undefined) {
            user.refresh_token = refresh_token;
            user.save();
          }
          resolve({ access_token, type: "kakao" });
        });
      } else resolve("");
    });
  };

  const respond = (result) => {
    console.log(result);
    res.status(200).json({ success: true, result });
  };

  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };
  check_token().then(get_token).then(respond).catch(onError);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const check = (user) => {
    if (!user) {
      throw new Error("user not exist");
    } else {
      return user.verify(password).then((result) => {
        if (result) {
          return new Promise((resolve, reject) => {
            tokenGenerator(user, "14d").then((result) => {
              user.refresh_token = result.access_token;
              user.save();
              tokenGenerator(user, token_exp).then((result) => {
                resolve(result);
              });
            });
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
  if (req.body.profileObj === undefined) {
    return res.status(403).json({
      message: "cancel google login",
    });
  }
  console.log(req.body);
  const post = req.body.profileObj;
  const check = (user) => {
    if (!user) {
      console.log("user not found!");
      axios({
        method: "post",
        url: "/create/google",
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

  User.findOneByEmail(post.email).then(check).then(respond).catch(onError);
});

router.post("/login/kakao", (req, res) => {
  const email = req.body.profile.kakao_account.email;
  const check = (user) => {
    if (!user) {
      console.log("user not found!");
      axios({
        method: "post",
        url: "http://localhost:8000/create/kakao",
        data: {
          kakaodata: req.body,
        },
      });
    }
    user.refresh_token = req.body.response.refresh_token;
    user.save();
    res.status(200).json({
      message: "logged in successfully",
      nickname: req.body.profile.properties.nickname,
      access_token: req.body.response.access_token,
    });
  };

  User.findOneByEmail(email).then(check);
});

module.exports = router;
