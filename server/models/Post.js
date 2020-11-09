const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useCreateIndex", true);

const getCurrentDate = ()=>{
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}

const postSchema = new Schema({
  writer: {type: String, required:true},
  title: {type:String, required:true},
  category: {type:String, required:true},
  content: {type:String, required:true},
  created_At: { type: Date, default: getCurrentDate()},
  updated_At: {type:Date, default: getCurrentDate()},
  likes: {type: Array, default:[]},
  dislikes:{type:Array, default:[]},
  hits:{type:Number,default:0},
  hash_Tags:{type:Array, default:[]},
  Image_Direct:{type:Array, default:[]},
  is_Deleted: {type:Boolean, default:false}
});


postSchema.statics.create = function (
  title,
  content,
  writer,
  hash_Tags,
  category
) {
  const post = new this({
    title,
    content,
    writer,
    hash_Tags,
    category
  });

  return post.save();
};

module.exports = mongoose.model("Post", postSchema);
