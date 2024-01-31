import Forms from './components/Forms/index.jsx';
import{ Route, Routes, UNSAFE_useRouteId } from "react-router-dom";
import "./App.css";
import RoomPage from "./pages/RoomPage"

const App = () => {

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
        <Route path="/" element={<Forms uuid = {uuid}/>} />
        <Route path="/:roomId" element={<RoomPage/>} />
      </Routes>
      
      
    </div>
  );
};

export default App;
