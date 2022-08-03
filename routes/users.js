const express = require('express');
const router = express.Router();
const { User } = require("../models");

router.post('/users', async (req,res) => {
    const {nickname, password, confirm} = req.body;
    
    const existUser = await User.findOne({where : {nickname}});
    let nicknametest = /^[A-Za-z0-9]{3,}$/;
    if(password.match(nickname)) {
        res.status(400).json({success:false, errorMessage : "비밀번호와 닉네임이 같은 값이 포함되어 회원가입이 실패하였습니다."});
        return;
    }

    if(password.length < 4) {
        res.status(400).json({success: false, errorMessage : "비밀번호는 최소 4자리이어야 합니다."});
        return;
    }

    
    if(!nicknametest.test(nickname)){
        res.status(400).json({success: false, errorMessage : "아이디 양식이 맞지 않습니다."});
        return;
    };
    if(password !== confirm) {
        res.status(400).json({success: false, errorMessage : "비밀번호와 확인 비밀번호가 일치하지  않습니다."});
        return ; // if문의 조건을 충족시키면 if문 아래의 코드들을 실행시키지 않기 위해
    }
    if(existUser) {
        console.log("existUser",existUser);
        res.status(400).json({success: false, errorMessage:  "중복된 닉네임입니다."});
        return ;
    };
    
    const Createduser = await User.create({nickname, password});
    res.status(201).json({success: true, message: "회원 가입에 성공하였습니다."}); // status code 201은 create를 의미해서 더 적합하다.

});



















module.exports = router;