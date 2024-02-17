import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoomForm = ({ socket, setUser, uuid }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleRoomJoin = (e) => {
    e.preventDefault();

    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: false,
      presenter: false,
    };

    // setUser(roomData);
    socket.emit("userJoined", roomData);
    navigate(`/${roomId}`);
  };

  return (
    <form className="form col-md-12 mt-5">
      <div className="form-control">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter Room Code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button
          type="submit"
          onClick={handleRoomJoin}
          className="mt-4 btn btn-primary btn-block form-control"
        >
          Join Room
        </button>
      </div>
    </form>
  );
};

export default JoinRoomForm;
