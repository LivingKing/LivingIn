const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

mongoose.set("useCreateIndex", true);

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  nickname: { type: String, required: true },
  created_At: { type: Date, default: Date.now },
  icon: String,
  favorite_HashTag: String,
  refresh_token: String,
  is_admin: { type: Boolean, default: false },
});

userSchema.statics.create = function (
  email,
  password,
  nickname,
  icon,
  googleId,
  kakaoId
) {
  const user = new this({
    email,
    password,
    nickname,
    icon,
    googleId,
    kakaoId,
  });

  return user.save();
};

userSchema.statics.findOneByEmail = function (email) {
  return this.findOne({ email }).exec();
};

userSchema.statics.findOneByNick = function (nickname) {
  return this.findOne({ nickname }).exec();
};
userSchema.methods.verify = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

userSchema.methods.assginAdmin = function () {
  this.is_admin = true;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
