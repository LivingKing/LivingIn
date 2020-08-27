const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const token = req;
  console.log(token);
  res.send("hi", token);
});

module.exports = router;
