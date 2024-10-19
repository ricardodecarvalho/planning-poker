import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import PokerRoom from "./components/PokerRoom";
import Login from "./components/Login";
import Private from "./components/Private";
import Room from "./components/Room";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Private />}>
          <Route path="/" element={<Room />} />
          <Route path="/room/:roomId" element={<PokerRoom />} />
          <Route path="/private" element={<div>'The room is full :('</div>} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
