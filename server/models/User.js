const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

mongoose.set("useCreateIndex", true);

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  nickname: { type: String, required: true },
  created_At: { type: Date, default: Date.now },
  social_id: { type: String },
  icon: String,
  favorite_HashTag: String,
  refresh_token: String,
  is_admin: { type: Boolean, required: true, default: false },
  is_active: { type: Boolean, required: true, default: false },
});

userSchema.statics.create = function (
  email,
  password,
  nickname,
  icon,
  social_id,
  is_admin
) {
  const user = new this({
    email,
    password,
    nickname,
    icon,
    social_id,
    is_admin,
  });

  return user.save();
};

userSchema.statics.findOneByEmail = function (email) {
  return this.findOne({ email }).exec();
};

userSchema.statics.findOneByNick = function (nickname) {
  return this.findOne({ nickname }).exec();
};

userSchema.statics.findOneBySocialId = function (social_id) {
  return this.findOne({ social_id }).exec();
};
userSchema.methods.verify = function async(password) {
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
