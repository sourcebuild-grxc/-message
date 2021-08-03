module.exports = function (io) {
  //判断用户是否在线
  let socketList = {};
  //在线人数数组
  let users = [];

  //连接
  io.on("connection", (socket) => {
    console.log("一个用户连接成功");
    //用户断开连接
    socket.on("disconnect", () => {
      if (socketList.hasOwnProperty(socket.name)) {
        console.log("用户退出");
        // 删除在线人数
        for (let i = 0; i < users.length; i++) {
          if (users[i].name === socket.name) {
            users.splice(i, 1);
          }
        }
        delete socketList[socket.name];
        io.emit("userclose", socket.name, users);
      }
    });

    //用户进入群聊 连接成功
    socket.on("userInto", (data, img) => {
      console.log("用户进入", data, img);
      //将用户名储存到 socket 中
      socket.name = data;
      //根据用户名储存用户id
      socketList[data] = socket.id;
      let user = { name: data, imgs: img, id: socket.id, tip: false };
      users.push(user);
      //广播所有人
      socket.broadcast.emit("userintochat", data, users);
      socket.emit("userib", data, users, socket.id);
    });
    //消息发送 所有人
    socket.on("submit", (data) => {
      data.time = +new Date();
      //广播出去 自己不可见
      socket.broadcast.emit("publicCadio", data);
      console.log("信息发送：", data);
    });
    //一对一聊天
    socket.on("otochat", (ress) => {
      console.log("私聊信息：", ress);
      io.to(ress.tid).emit("otochatquest", ress);
    });
  });
};
