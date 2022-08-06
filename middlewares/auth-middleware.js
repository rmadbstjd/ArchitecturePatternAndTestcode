const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
const tokenValue = req.cookies.token;
if (!tokenValue) {
    res
      .status(401)
      .json({ success: false, errorMessage: "로그인이 필요합니다." });
    return;
  }

  try {
    const { userId } = jwt.verify(tokenValue, "my-secret-key"); // userId 는 jwt.sign(userId : user._id)의 user._id가 할당된다.

    User.findByPk(userId).then((user) => {
    next();
    });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, errorMessage: "로그인이 필요합니다." });
    return;
  }
};
