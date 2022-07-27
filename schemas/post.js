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
  user : {
    type : String,
  },
  createdAt : {
    type : String,
  },
  


});

module.exports = mongoose.model("Posts", goodsSchema);