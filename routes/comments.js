const express = require('express');
const comment = require('../schemas/comment');
const router = express.Router();
const Comments = require("../schemas/comment"); 
const dayjs = require("dayjs");
console.log('test');
router.post('/comments/:postId', async(req,res) => {
    const {user,password,content} = req.body;
    const {postId} = req.params;
    const comments = await Comments.find({user});
    let now = dayjs();
    now.format();
    let createdAt = now.format("YYYY-MM-DD HH:mm:ss");
    if(content === "") {
        
        return res.status(400).json({success: false, errorMessage: "댓글 내용을 입력해주세요."});
    }

    const createdComments = await Comments.create({user,password,content,postId,createdAt});
    res.json({
        success: true, message:"댓글을 작성하였습니다!"
    });
});
router.get('/comments/:postId', async(req,res) => {
    
    const {postId} = req.params;
    const comment = await Comments.find({postId : postId});
    const sorted_comment = comment.sort(function(a,b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
   }).reverse();
    res.json({
        data : sorted_comment.map((sorted_comment) =>({
        commentId : sorted_comment._id,
        user: sorted_comment.user,
        content: sorted_comment.content,
        createdAt : sorted_comment.createdAt,
        })),
    });
});
router.put('/comments/:commentId', async(req,res) =>{
    const {commentId} = req.params;
    const {password, content} = req.body;
    const commentpw = await Comments.find({_id : commentId});
    
    if(content === ""){
        return res.status(400).json({success: false, errorMessage: "댓글 내용을 입력해주세요."});
    }
    else if(content === undefined) {
        return res.status(400).json({success: false, errorMessage: "잘못된 형식으로 요청하였습니다."});
    }
    else if(password === ""){
        return res.status(400).json({success: false, errorMessage: "비밀번호를 입력해주세요."});
    } 
    else if(password !== String(commentpw[0].password)) {
        res.status(400).json({success: false, errorMessage: "비밀번호가 일치하지 않아 댓글 수정이 불가능합니다."});
    }
    else {
        
        await Comments.updateOne({_id : commentId}, {$set : {content: content}});
    }

    res.json({
        success:true, message: "댓글을 수정하였습니다."
    })
    
});

router.delete('/comments/:commentId', async(req,res) => {
    const {commentId} = req.params;
    const {password} = req.body;
    const exsistsComment = await Comments.find({_id : commentId});
    if(exsistsComment.length) {
        if(password === String(exsistsComment[0].password)) {
            await Comments.deleteOne({_id : commentId});
            
        }
        else {
            res.status(400).json({success: false, errorMessage: "비밀번호가 일치하지 않아 댓글 수정이 불가능합니다."});
        }
    }
    else {
        return res.status(400).json({success: false, errorMessage: "삭제할 댓글이 없습니다."});
    }
    res.json({
        success: true,  message: "댓글을 삭제하였습니다."
    }) 
});
module.exports = router;