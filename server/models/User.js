const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  nickname: String,
  created_At: { type: Date, default: Date.now },
  icon: String,
  Favorite_HashTag: String,
  googleId: String,
  kakaoId: String,
  is_admin: Boolean,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
