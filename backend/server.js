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
    console.log("user connected");
});

server.listen(port, () => console.log("server is running on http://localhost:5001"));