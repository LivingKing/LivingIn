const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("useCreateIndex", true);

const commentSchema = new Schema({
  id: {type:Number, required:true, unique:true},
  post_id: {type:String, required:true},
  writer: {type: String, required:true},
  content: {type:String, required:true},
  created_At: { type: Date, default: Date.now },
  updated_At: {type:Date, default: Date.now},
  is_Deleted: {type:Boolean, default:false}
});

commentSchema.statics.create = function (
  id,
  post_id,
  writer,
  title,
  content
) {
  const comment = new this({
    id,
    post_id,
    writer,
    title,
    content,
  });

  return comment.save();
};


module.exports = mongoose.model("Comment", commentSchema);
