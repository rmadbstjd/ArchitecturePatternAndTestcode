const mongoose = require("mongoose");

const goodsSchema = new mongoose.Schema({

  title: {
    type: String,
    
    },
  content : {
    type: String,
  },
  postId: {
    type: String,
    
  },
  password : {
    type : String,
    
  },
  nickname : {
    type : String,
  },
  createdAt : {
    type : String,
  },
  userId : {
    type : String,
  },
  like : {
    type : Number,
    default : 0,
  },
  like_array : {
    type : Array,
  },
 

});

module.exports = mongoose.model("Posts", goodsSchema);