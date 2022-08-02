const mongoose = require("mongoose");

const goodsSchema = new mongoose.Schema({
 nickname : {
  type : String,
 },
  content : {
    type: String,
  },
 password: {
    type : String,
  },
  postId : {
    type : String,
  },
  createdAt : {
    type : String,
  },
  userId : {
    type: String,
  },
  commentId : {
    type : String,
  },


});

module.exports = mongoose.model("Comments", goodsSchema);