const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const token = req.headers;
  console.log(token);
  res.send("hi");
});

module.exports = router;
