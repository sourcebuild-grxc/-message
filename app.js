const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello grxv</h1>");
});

//socket 另起一个端口
const Server = app.listen(3005);
const io = require("socket.io").listen(Server);

require("./model/socket")(io);

app.listen(3002, () => {
  console.log("服务器连接成功 3002");
});
