const express = require('express');
const comment = require('../schemas/comment');
const router = express.Router();
const Comments = require("../schemas/comment"); 
const dayjs = require("dayjs");

router.post('/comments/:postId', async(req,res) => {
    const {user,password,comment} = req.body;
    const {postId} = req.params;
    const comments = await Comments.find({user});
    let now = dayjs();
    now.format();
    let createdAt = now.format("YYYY-MM-DD HH:mm:ss");
    console.log(createdAt);
    if(comments.length) {
        return res.status(400).json({success: false, errorMessage : "이미 있는 데이터입니다."});
    }
    const createdComments = await Comments.create({user,password,comment,postId,createdAt});
    res.json({
        success: true, message:"댓글을 작성하였습니다!"
    });
});
router.get('/comments/:postId', async(req,res) => {
    
    const {postId} = req.params;
    const comment = await Comments.find({postId : postId});
    console.log(comment);
    const sorted_comment = comment.sort(function(a,b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
   }).reverse();
    res.json({
        data : sorted_comment.map((sorted_comment) =>({
        commentId : sorted_comment._id,
        user: sorted_comment.user,
        comment: sorted_comment.comment,
        createdAt : sorted_comment.createdAt,
        })),
    });
});
router.put('/comments/:commentId', async(req,res) =>{
    const {commentId} = req.params;
    const {password, re_comment} = req.body;
    const commentpw = await Comments.find({_id : commentId});
    if(password != commentpw[0].password) {
        res.status(400).json({success: false, errorMessage: "비밀번호가 일치하지 않아 댓글 수정이 불가능합니다."});
    }
    else {
        
        await Comments.updateOne({_id : commentId}, {$set : {comment: re_comment}});
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
        if(password == exsistsComment[0].password) {
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