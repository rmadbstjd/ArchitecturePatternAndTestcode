const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");

//로그인 기능을 POST 메소드로 하는 이유 : 토큰을 로그인할때마다 발행해주는다는 의미로 POST로 사용하기도 하나
//POST Methor가 아닌 GET Method로 한다면 body에 데이터를 실을 수 없고 Query String 주소 뒤에 ?해서 email=~~~~, password = ~~~~ 하면
//주소가 노출이되므로 보안에 취약하다.


router.post('/login', async (req,res) =>{
    //const {authorization} = req.headers; // headers 안에 header가 포함됨.  
    //console.log(authorization);
    

    //로그인이 되어있는데 또 로그인을 시도하는 경우
    if(req.cookies.token) {      
            res.status(401).json({success: false, errorMessage: "이미 로그인이 되어있습니다."});
            return;
     }
     //로그인시 닉네임 또는 패스워드가 일치하지 않는 경우
    const {nickname,password} = req.body;
    const user = await User.findOne({ where : {nickname,password}}); //await을 안쓰니까 promise에러가 안남
    
    if(!user) {
        res.status(400).json({success: false, errorMessage: "닉네임 또는 패스워드가 일치하지 않습니다."});
        return ; 
    }
    console.log("유저",user);
    console.log("유저아디",user.userId)
    // 위의 조건을 모두 만족하면 토큰 생성 및 클라이언트로 보낼 payload 작성
    let payload = {userId: user.userId, nickname : nickname};
    const token = jwt.sign(payload, 'my-secret-key'); //jwt.sign(payload, secret, options),payload에는 JWT에 저장되는 정보로 key:value로 구성된다.
    res.cookie('token',token);
        
                                                    장
        res.json({success:true, message: "로그인이 성공되었습니다."});
    
});

module.exports = router;