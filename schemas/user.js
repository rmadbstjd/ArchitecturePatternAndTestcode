const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  
  nickname: {
    type: String,
  },
  password: {type: String,}
  ,
  like_done : {
    type: Boolean,
  },
  get_like_post : {
    type : Array,
  },
});
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Users", UserSchema);