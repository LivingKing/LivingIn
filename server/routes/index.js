const express = require("express");
const router = express.Router();
const User = require("../models/User");
router.get("/users", (req, res) => {
  User.find({}, (err, users) => {
    if (err) throw err;
    console.log(users);
    res.json(users);
  });
});

module.exports = router;
