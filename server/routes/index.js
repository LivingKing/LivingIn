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

router.get("/all_delete", (req, res) => {
  User.remove({}, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json({
      message: "all data clear",
    });
  });
});

module.exports = router;
