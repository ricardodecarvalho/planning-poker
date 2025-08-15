import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Private from "./Private";
import PokerRoom from "./PokerRoom/PokerRoom";
import Rooms from "./Rooms";
import Kanban from "./Kanban/Kanban";

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
          <Route path="/full-room" element={<div>'The room is full :('</div>} />

          <Route path="/kanban" element={<Kanban />} />

          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
