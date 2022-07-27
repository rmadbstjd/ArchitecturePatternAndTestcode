const express = require('express');
const connect = require("./schemas");

  // ./schemas/index이지만 index는 생략할 수 있다. schema.js를 먼저 찾고 없으면 index.js를 후에 찾는다.
const app = express();
const port = 3000;
connect();
const postRouter = require("./routes/posts");
const commentRouter = require("./routes/comments");
app.use(express.urlencoded());
app.use(express.static("static"));
app.use(express.json()); // body로 들어오는 json 형태의 데이터를 파싱해준다.
app.use("/api", [postRouter,commentRouter]);

app.get('/', (req, res) => {
  res.send('Hello World!!!!!!!');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});