import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18n-lite';
import { Users } from 'lucide-react';

import Button from './ui/Button';
import { MAX_PARTICIPANTS } from '../hooks/useParticipants';

const Wrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px clamp(16px, 4vw, 28px) 96px;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 460px;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;

  .badge {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-lg);
    background: var(--warning-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
  }
  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.01em;
  }
  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14.5px;
    max-width: 40ch;
    line-height: 1.55;
  }
`;

const RoomFull = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const message = t('rooms.roomFullMessage').replace(
    '{max}',
    String(MAX_PARTICIPANTS),
  );

  return (
    <Wrap>
      <Card>
        <div className="badge">
          <Users size={30} color="var(--warning)" />
        </div>
        <h1>{t('rooms.roomFullTitle')}</h1>
        <p>{message}</p>
        <div style={{ marginTop: 12 }}>
          <Button variant="primary" onClick={() => navigate('/')}>
            {t('rooms.backToRooms')}
          </Button>
        </div>
      </Card>
    </Wrap>
  );
};

export default RoomFull;
