const mongoose = require("mongoose");

const goodsSchema = new mongoose.Schema({
 user : {
  type : String,
 },
  content : {
    type: String,
  },
 password: {
    type : Number,
  },
  postId : {
    type : String,
  },
  createdAt : {
    type : String,
  },


});

module.exports = mongoose.model("Comments", goodsSchema);