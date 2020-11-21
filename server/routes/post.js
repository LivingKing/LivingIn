const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User")
const config = require("../config/config");
const { post } = require("./api");
const jwt = require('jsonwebtoken');


router.post("/",async(req,res)=>{
    const {title, content, writer, tags, category} = req.body;
    // const nicknname = await jwt.verify(token,config.secret).nicknname;
    Post.create(
        title,
        content,
        writer,
        tags,
        category
    ).then(()=>{
        res.status(200).json({
            message: "post successfully",
          });
    })

})


module.exports = router;