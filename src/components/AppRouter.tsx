import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Private from "./Private";
import PokerRoom from "./PokerRoom/PokerRoom";
import Rooms from "./Rooms";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Private />}>
          <Route path="/" element={<Rooms />} />
          <Route path="/create-room" element={<Rooms />} />
          <Route path="/room/:roomId" element={<PokerRoom />} />
          <Route path="/Rooms" element={<Rooms />} />
          <Route path="/private" element={<div>'The room is full :('</div>} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
