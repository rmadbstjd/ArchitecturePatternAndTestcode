const express = require('express');
const moment = require('moment');
const router = express.Router();
const Posts = require("../schemas/post"); 

const dayjs = require("dayjs");


router.get('/posts', async (req, res) => {
   const post = await Posts.find();
   const sorted_post = post.sort(function(a,b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
   }).reverse();

    res.json({
        data : sorted_post.map((sorted_post) => ({
            postId : sorted_post._id,
            user : sorted_post.user,
            title : sorted_post.title,
            createdAt : sorted_post.createdAt,
        })),
    });
    
  });
router.get('/posts/:postId', async(req, res) => {
    
    const postId = req.params.postId;
    const post = await Posts.find({_id : postId});
    console.log(post);
    res.json({
        data : post.map((post) => ({
            postId : post._id,
            user : post.user,
            title : post.title,
            content : post.content,
            createdAt : post.createdAt,
            
        })),
    });
});
router.put('/posts/:postId', async(req, res) => {
    const postId = req.params.postId;
    const {password, title, content} = req.body; //re_title이라 작성하지 않고 title이라고 작성학 $set에서 {title: title}하면 오류남
    const postpw = await Posts.find({_id : postId});
   
    if(password !== String(postpw[0].password)) {
         res.status(400).json({success: false, errorMessage: "비밀번호가 일치하지 않아 게시글 수정이 불가능합니다."});
    }
    else {
        
        await Posts.updateOne({_id : postId}, {$set : {title: title, content: content}});
    }
    res.json({
        success:true, message:"게시글 수정 완료!"
    });
});
router.delete('/posts/:postId', async(req, res) =>{
    
    const {postId} = req.params;
    const {password} = req.body;
    const exsistsPost = await Posts.find({_id : postId});
    
    if(exsistsPost.length) {
        if(password === String(exsistsPost[0].password)){
            await Posts.deleteOne({_id : postId});
        }
        else {
            return res.status(400).json({success: false, errorMessage: "비밀번호가 일치하지 않습니다."});
        }
    res.json({
        success:true, msg:"게시글을 삭제했습니다."
    });
    }
    else {
        return res.status(400).json({success: false, errorMessage: "삭제할 게시글이 없습니다."});
    }
});
router.post('/posts', async(req, res) => {
    const {user, title, content, password}= req.body;
    let now = dayjs();
    now.format();
    let createdAt = now.format("YYYY-MM-DD HH:mm:ss");
    //console.log(typeof(now_time));
    //let now_now_time = Date.parse(now_time);
    //console.log(typeof(now_time,now_now_time));
    const posts = await Posts.find({user});
    
    if(posts.length) {
        return res.status(400).json({success: false, errorMessage : "이미 있는 데이터입니다."});
    };
    const createdPosts = await Posts.create({title, content,password, user, createdAt});
    
    res.json({success : true, message : "게시글을 생성하였습니다."});
});
module.exports = router;