const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const config = require("../config/config");
const { post } = require("./api");


router.post("/",(req,res)=>{
    const {title, content, writer, tags, category} = req.body;
    console.log(req.body);
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