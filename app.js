const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/auth-middleware");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");

const RoutesLogin = require("./routes/login");
const RoutesUser = require("./routes/users");
const RoutesPost = require("./routes/posts");
const RoutesComment = require("./routes/comments");
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.json()); // body로 들어오는 json 형태의 데이터를 파싱해준다.
app.use("/api", [RoutesLogin,RoutesUser,RoutesPost,RoutesComment]);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
