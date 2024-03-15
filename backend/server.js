const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser, getUser, removeUser } = require("./utils/users");

const io = new Server(server);
const port = process.env.PORT || 5001;


// routes
app.get("/", (req, res) =>{
    res.send("This is mern white board sharing app server by our team");
});

let roomIdGlobal, imgURLGlobal;

io.on("connection", (socket) => {
    socket.on("userJoined", (data) => {
        const {name, userId, roomId, host, presenter} = data;
        roomIdGlobal = roomId;
        socket.join(roomId);
        const users=addUser({name,userId,roomId,host, presenter, socketId:socket.id });
        // console.log(data);
        socket.emit("userIsJoined", {success : true,users});
        socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted",name);
        // socket.emit("allUsers",users);
        socket.broadcast.to(roomId).emit("allUsers",users);
        socket.broadcast.to(roomId).emit("whiteboardDataResponse", {
            imgURL : imgURLGlobal,
        });
    });

    socket.on("whiteboardData", (data) => {
        imgURLGlobal = data;
        socket.broadcast.to(roomIdGlobal).emit("whiteboardDataResponse", {
            imgURL : data,
        });
    });
    console.log("socketttt",socket.id);
    socket.on("message", (data) => {
        const { message } = data;
        const user = getUser(socket.id);
        if (user) {
          socket.broadcast
            .to(roomIdGlobal)
            .emit("messageResponse", { message, name: user.name });
        }
      });
    socket.on("disconnect",()=>{
        const user = getUser(socket.id);
        console.log("disss",user);
        if(user){
            removeUser(socket.id);
            socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBroadcasted", user.name);
        }
        
        // console.log(user);
    });
});

const host="localhost"

server.listen(port,host,()=>{
    console.log("server is listening")
})