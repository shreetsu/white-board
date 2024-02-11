const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");

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
        console.log(data);
        socket.emit("userIsJoined", {success : true})
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
});

const host="localhost"

server.listen(port,host,()=>{
    console.log("server is listening")
})