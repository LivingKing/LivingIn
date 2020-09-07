const express = require("express");
const router = express.Router();
const User = require("../models/User");
router.get("/users", (req, res) => {
  User.find({}, (err, users) => {
    if (err) throw err;
    res.json(users);
  });
});

router.get("/forget/user", (req, res) => {
  const { email } = req.body;
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

module.exports = router;
