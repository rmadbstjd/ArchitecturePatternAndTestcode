const express = require('express');
const router = express.Router();
const { Comment } = require("../models"); 
const dayjs = require("dayjs");
const authMiddleware = require("../middlewares/auth-middleware");
const jwt = require("jsonwebtoken");

//댓글 작성 API
router.post('/comments/:postId', authMiddleware, async(req,res) => {
    
    const tokenValue = req.cookies.token;
    const {userId,nickname}  = jwt.verify(tokenValue, "my-secret-key");
    const {content} = req.body;
    const {postId} = req.params;
    let now = dayjs();
    now.format();
    let createdAt = now.format("YYYY-MM-DD HH:mm:ss");
    if(content === "") {
        
        return res.status(400).json({success: false, errorMessage: "댓글 내용을 입력해주세요."});
    }
    
    const createdComments = await Comment.create({userId, nickname, content, postId, createdAt});
    
    res.json({
        success: true, message:`${nickname}님이 댓글을 작성하였습니다!`
    });
});
//댓글 목록 조회 API
router.get('/comments/:postId', async(req,res) => {
    
    const {postId} = req.params;
    const comment = await Comment.findAll({where : {postId}});
    console.log(comment);
    const sorted_comment = comment.sort(function(a,b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
   }).reverse();
    res.json({
        data : sorted_comment.map((sorted_comment) =>({
        commentId : sorted_comment.id,
        userId: sorted_comment.userId,
        nickname : sorted_comment.nickname,
        content: sorted_comment.content,
        createdAt : sorted_comment.createdAt,
        })),
    });
});
//댓글 수정 API
router.put('/comments/:commentId', authMiddleware,async(req,res) =>{
    
    const {commentId} = req.params;
    const tokenValue = req.cookies.token;
    const {userId, nickname}  = jwt.verify(tokenValue, "my-secret-key");
    const {content} = req.body;
    const commentpw = await Comment.findOne({where:{id : commentId}});
    if(nickname !==commentpw.nickname) {
        return res.status(400).json({success: false, errorMessage: `${nickname}님은 ${commentpw.nickname}의 댓글을 수정할 수 없습니다.`});
    }
    else if(content === ""){
        return res.status(400).json({success: false, errorMessage: "댓글 내용을 입력해주세요."});
    }
    else if(content === undefined) {
        return res.status(400).json({success: false, errorMessage: "잘못된 형식으로 요청하였습니다."});
    }
    await Comment.update({content},{where : {id : commentId}});
    res.json({
        success:true, message: "댓글을 수정하였습니다."
    })
    
});
//댓글 삭제 API
router.delete('/comments/:commentId', authMiddleware, async(req,res) => {
    const {commentId} = req.params;
    const tokenValue = req.cookies.token;
    const {userId, nickname}  = jwt.verify(tokenValue, "my-secret-key");
    const exsistsComment = await Comment.findOne({where: {id : commentId}});
    
    if(nickname !== exsistsComment.nickname) {
        return res.status(400).json({success: false, errorMessage: `${nickname}님은 ${exsistsComment.nickname}의 댓글을 삭제할 수 없습니다.`});
    }
    await Comment.destroy({where : {id : commentId}});
    res.json({
        success: true,  message: "댓글을 삭제하였습니다."
    }) 
});
module.exports = router;