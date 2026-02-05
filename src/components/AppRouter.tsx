import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Private from './Private';
import PokerRoom from './PokerRoom/PokerRoom';
import Rooms from './Rooms';
import { useTranslation } from 'react-i18n-lite';

const AppRouter = () => {
  const { t } = useTranslation();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Private />}>
          <Route path="/" element={<Rooms />} />
          <Route path="/create-room" element={<Rooms />} />
          <Route path="/room/:roomId" element={<PokerRoom />} />
          <Route path="/Rooms" element={<Rooms />} />
          <Route
            path="/full-room"
            element={<div>{t('pokerRoom.fullRoom')}</div>}
          />
          <Route path="*" element={<div>{t('404.pageNotFound')}</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
