// RoomPage.jsx
import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import Whiteboard from "../../components/Whiteboard";
import Chat from "../../components/ChatBar";

const RoomPage = ({ user, socket, users }) => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("black");
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [openedUserTab, setOpenedUserTab] = useState(false);
    const [openedChatTab, setOpenedChatTab] = useState(false);
    const [chat, setChat] = useState([]);

    useEffect(() => {
        socket.on("messageResponse", (data) => {
            setChat((chat) => [...chat, data]);
        });
        return () => {
            socket.off("messageResponse");
        };
    }, [socket]);

    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setElements([]);
    };

    const undo = () => {
        setHistory((prevHistory) => [...prevHistory, elements[elements.length - 1]]);
        setElements((prevElements) => prevElements.slice(0, prevElements.length - 1));
    };

    const redo = () => {
        setElements((prevElements) => [...prevElements, history[history.length - 1]]);
        setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
    };

    const handleSubmitMessage = (message) => {
        if (message.trim() !== "") {
            setChat((prevChats) => [...prevChats, { message, name: user.name }]);
            socket.emit("message", { message });
        }
    };

    return (
        <div className="row">
            <button
                type="button"
                className="btn btn-dark"
                style={{
                    display: "block",
                    position: "absolute",
                    top: "5%",
                    left: "3%",
                    height: "40px",
                    width: "100px",
                }}
                onClick={() => setOpenedUserTab(true)}
            >
                Users
            </button>
            <button
                type="button"
                className="btn btn-primary"
                style={{
                    display: "block",
                    position: "absolute",
                    top: "5%",
                    left: "10%",
                    height: "40px",
                    width: "100px",
                }}
                onClick={() => setOpenedChatTab(true)}
            >
                Chats
            </button>

            {openedUserTab && (
                <div
                    className="position-fixed top-0 h-100 text-white bg-dark"
                    style={{ width: "250px", left: "0%" }}
                >
                    <button
                        type="button"
                        className="btn btn-light btn-block w-100 mt-5"
                        onClick={() => setOpenedUserTab(false)}
                    >
                        close
                    </button>
                    <div className="w-100 mt-5 pt-5">
                        {users.map((usr, index) => (
                            <p key={index * 999} className="my-2 text-center w-100">
                                {usr.name} {user && user.userId === usr.userId && "(You)"}
                            </p>
                        ))}
                    </div>
                </div>
            )}
            {openedChatTab && (
                <Chat
                    setOpenedChatTab={setOpenedChatTab}
                    socket = {  socket  }
                />
            )}

            <h1 className="text-center py-4">
                White Board Sharing App{" "}
                <span className="text-primary">[Users online: {users.length}]</span>
            </h1>
            {user?.presenter && (
                <div className="col-md-10 mx-auto px-5 mb-3 d-flex align-items-center justify-content-center">
                    <div className="d-flex col-md-2 justify-content-center gap-1">
                        <div className="d-flex gap-1 align-items-center">
                            <label htmlFor="pencil">Pencil</label>
                            <input
                                type="radio"
                                name="tool"
                                id="pencil"
                                checked={tool === "pencil"}
                                value="pencil"
                                className="mt-1"
                                onChange={(e) => setTool(e.target.value)}
                            />
                        </div>
                        <div className="d-flex gap-1 align-items-center">
                            <label htmlFor="line">Line</label>
                            <input
                                type="radio"
                                name="tool"
                                id="line"
                                checked={tool === "line"}
                                value="line"
                                className="mt-1"
                                onChange={(e) => setTool(e.target.value)}
                            />
                        </div>
                        <div className="d-flex gap-1 align-items-center">
                            <label htmlFor="rect">Rectangle</label>
                            <input
                                type="radio"
                                name="tool"
                                id="rect"
                                checked={tool === "rect"}
                                value="rect"
                                className="mt-1"
                                onChange={(e) => setTool(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 mx-auto">
                        <div className="d-flex align-items-center justify-content-center">
                            <label htmlFor="color">Select color: </label>
                            <input
                                type="color"
                                id="color"
                                className="mt-1 ms-3"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 d-flex gap-2">
                        <button
                            className="btn btn-primary mt-1"
                            onClick={() => undo()}
                            disabled={elements.length === 0}
                        >
                            Undo
                        </button>
                        <button
                            className="btn btn-outline-primary mt-1"
                            onClick={() => redo()}
                            disabled={history.length < 1}
                        >
                            Redo
                        </button>
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-danger" onClick={handleClearCanvas}>
                            Clear Canvas
                        </button>
                    </div>
                </div>
            )}

            <div className="col-md-10 mx-auto mt-4 canvas-box">
                <Whiteboard
                    canvasRef={canvasRef}
                    ctxRef={ctxRef}
                    elements={elements}
                    setElements={setElements}
                    color={color}
                    tool={tool}
                    user={user}
                    socket={socket}
                />
            </div>
        </div>
    );
};

export default RoomPage;
