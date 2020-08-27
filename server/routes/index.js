const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const token = req.headers["x-access-token"];
  console.log(req);
  res.send("hi", token);
});

module.exports = router;
