import Forms from './components/Forms/index.jsx';
import { Route, Routes, UNSAFE_useRouteId } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import RoomPage from "./pages/RoomPage"
import { useEffect, useState } from 'react';

const server = "http://localhost:5001";
const connectionOptions = {
  "force new connection " : true,
  reconnectionAttempts : "Infinity",
  timeout : 10000,
  transports : ["websocket"],

};

const socket = io(server, connectionOptions);

const App = () => {
  const [user, setUser] = useState([null]);
  const [users,setUsers] =useState([]);

  useEffect(() => {
    socket.on("userJoined", (data) => {
      if (data.success) {
        console.log("userJoined");
        console.log(data);
        setUsers(data.users);
        // setUser([{
        //   host: true,
        //   name: "uyyy",
        // }]);
      } else {
        console.log("userJoined error");
      }
    });

    socket.on("allUsers",(data)=>{
      setUsers(data);
    });

  }, []); // Add user as a dependency
  

  console.log(user);

  const uuid = () => {
    let s4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      s4() + 
      s4() + 
      "-" +
      s4() + 
      "-" +
      s4() + 
      "-" +
      s4() + 
      "-" +
      s4() +
      s4() +
      s4()
    );
  };

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Forms uuid = {uuid} socket = {socket} setUser={setUser}/>} />
        <Route path="/:roomId" element={<RoomPage user = {user} socket = {socket} users={users}/>} />
      </Routes>
      
      
    </div>
  );
};

export default App;
