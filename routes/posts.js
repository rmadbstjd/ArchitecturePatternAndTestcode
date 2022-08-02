const express = require('express');
const moment = require('moment');
const router = express.Router();
const Posts = require("../schemas/post"); 
const Users = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
let like = 0;
//게시글 등록 API
router.post('/posts',  authMiddleware, async(req, res) => {
    const tokenValue = req.cookies.token;
    const {userId, nickname}  = jwt.verify(tokenValue, "my-secret-key");
    const {title, content}= req.body;
    let now = dayjs();
    now.format();
    let createdAt = now.format("YYYY-MM-DD HH:mm:ss");
    const createdPosts = await Posts.create({userId, nickname, title, content, createdAt, like});
    res.json({success : true, message : `${nickname}님의 게시글을 생성하였습니다.`});
});

//전체 게시글 조회 API
router.get('/posts', async(req, res) => {
   const post = await Posts.find();
   const sorted_post = post.sort(function(a,b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
   }).reverse();
    res.json({
        data : sorted_post.map((sorted_post) => ({  // arrow function의 특징 : 객체를 반환할 때 => 뒤에 ({})를 붙여야 한다.
            postId : sorted_post._id,
            userId : sorted_post.userId,
            nickname : sorted_post.nickname,
            title : sorted_post.title,
            createdAt : sorted_post.createdAt,
            like : sorted_post.like,
            
        })),
    });
    
  });
// 게시글 상세 조회 API
router.get('/posts/:postId', async(req, res) => {
 
    const postId = req.params.postId;
    const post = await Posts.findOne({_id : postId});
    
    
    res.json({
        data : {         
            postId : post._id,
            nickname : post.nickname,
            title : post.title,
            content : post.content,
            createdAt : post.createdAt,
            userId : post.userId,
            like : post.like,
            like_array : post.like_aaray,
        }
            
        
    });
});
//게시글 수정 API
router.put('/posts/:postId', authMiddleware, async(req, res) => {
    const postId = req.params.postId;
    const tokenValue = req.cookies.token;
    const {userId,nickname}  = jwt.verify(tokenValue, "my-secret-key");
    const {title, content} = req.body; //re_title이라 작성하지 않고 title이라고 작성학 $set에서 {title: title}하면 오류남
    const postpw = await Posts.findOne({_id : postId});
    console.log(nickname, postpw.nickname);
    if(nickname !== postpw.nickname) {
        return res.status(400).json({success: false, errorMessage: `${nickname}님은 ${postpw.nickname}님의 게시글을 수정할 수 없습니다.`});
    }

    
        
    await Posts.updateOne({_id : postId}, {$set : {title: title, content: content}});
    
    res.json({
        success:true, message:`게시글을 수정하였습니다.`
    });
});
//게시글 삭제 API
router.delete('/posts/:postId', authMiddleware, async(req, res) =>{
    const postId = req.params.postId;
    const tokenValue = req.cookies.token;
    const {userId,nickname}  = jwt.verify(tokenValue, "my-secret-key");
    const existsPost = await Posts.findOne({_id : postId});
    if(nickname !== existsPost.nickname) {
        return res.status(400).json({success: false, errorMessage: `${nickname}님은 ${existsPost.nickname}님의 게시글을 삭제할 수 없습니다.`});
    }
    await Posts.deleteOne({userId : userId});
    return res.json({
            success:true, msg:`게시글을 삭제했습니다.`
    });
    

});
//게시글 좋아요 API
router.put('/posts/:postId/like', authMiddleware, async(req,res) => {
    
    const tokenValue = req.cookies.token;
    const {userId,nickname}  = jwt.verify(tokenValue, "my-secret-key");
    const user = await Users.findOne({nickname});
    const postId = req.params.postId;
    const post = await Posts.findOne({_id : postId});
    let likes = post.like;
    console.log(post.like_array);
    if(post.like_array.includes(nickname)) {
        console.log("들어있음");
        likes -= 1;
        const pushlike = await Posts.updateOne({_id : postId}, {$set : {like : likes}});
        const pusharray = await Posts. updateOne({_id : postId},{$pull: {like_array : nickname}});
        const user_pusharray = await Users.updateOne({nickname}, {$pull: {get_like_post : postId}});
        return res.json({success: true, message: "게시글의 좋아요를 취소하였습니다."});
    }
    else {
        console.log("안들어있음");
        
        likes += 1;
        const pushlike = await Posts.updateOne({_id : postId}, {$set : {like : likes}});
        const pusharray = await Posts.updateOne({_id : postId},{$push: {like_array : nickname}});
        const user_pusharray = await Users.updateOne({nickname}, {$push: {get_like_post : postId}});
        return res.json({success: true, message: "게시글의 좋아요를 등록하였습니다."});
       
    }   
});
router.get('/postss/like', authMiddleware, async(req,res) => {
    
    const tokenValue = req.cookies.token;
    const {userId, nickname}  = jwt.verify(tokenValue, "my-secret-key");
    
    const post = await Users.findOne({nickname});
    
    console.log(post.get_like_post);
    const sorted_posts = await Posts.find({_id : post.get_like_post});
    
    const sorted_post = sorted_posts.sort(function(a,b){
        return b.get_like_post - a.get_like_post;
    });
       
    

    res.json({
        data : sorted_post.map((sorted_post) => ({
            postId : sorted_post._id,
            userId : sorted_post.userId,
            nickname : sorted_post.nickname,
            title : sorted_post.title,
            createdAt : sorted_post.createdAt,
            like : sorted_post.like,
            
        })),
    });
  

 });
module.exports = router;
