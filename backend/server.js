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
io.on("connection", (socket) => {
    socket.on("userJoined", (data) => {
        const {name, userId, roomId, host, presenter} = data;
        socket.join(roomId);
        socket.emit("userIsJoined", {success : true})
    })
});

const host="localhost"

server.listen(port,host,()=>{
    console.log("server is listening")
})