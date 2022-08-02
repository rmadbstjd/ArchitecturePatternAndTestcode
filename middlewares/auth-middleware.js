const jwt = require("jsonwebtoken");
const Users = require("../schemas/user");
let authorization ="undefined";
module.exports = (req,res,next) =>{

        
    
    
    const tokenValue = req.cookies.token; // ex) authorization = Bearer ektopdpfkpslfplw12332klakalsdkwadlsgdflpgldfpg2

    
    
    if(!tokenValue) {
         res.status(401).json({success: false, errorMessage: "로그인이 필요합니다."});
        return;
    }
    
    try {
            const {userId}  = jwt.verify(tokenValue, "my-secret-key"); // userId 는 jwt.sign(userId : user._id)의 user._id가 할당된다.
            
            Users.findById(userId).then((user) => { //findOne이 안되는 이유,,,?
                
                res.locals.user = user; //locals라는 공간은 이 미들웨어를 사용하는 다른 곳에서도 공통적으로 사용할 수 있다.
                
                next(); 
            }); 
    } catch(error) {
        res.status(401).json({success: false, errorMessage: "로그인이 필요합니다."});
        return;
    }
    
};
