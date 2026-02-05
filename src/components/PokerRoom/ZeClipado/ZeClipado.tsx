import styled from 'styled-components';
import ZeClipadoPNG from './assets/ze-clipado.png';
import { useIsMobile } from '../../../hooks/useIsMobile';
import useChatAssistant, { Vote } from '../../../hooks/useChatAssistant';
import { useEffect, useState } from 'react';

type ZeClipadoProps = {
  votes: Vote[];
  isShowVotes: boolean;
};

const Container = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;

  padding: 0 0 50px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100px;
  z-index: 1000;
`;

const Message = styled.p`
  font-size: 0.8rem;
  width: 250px;
  margin: 0;
`;

const StyledButton = styled.button<{ $show: boolean }>`
  transform: translateY(${(p) => (p.$show ? '0' : '100%')});
  opacity: ${(p) => (p.$show ? 1 : 0)};
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;

  background: none;
  border: none;
  padding: 0;
  margin: 0;
`;

const ZeClipado = ({ votes, isShowVotes }: ZeClipadoProps) => {
  const [message, setMessage] = useState<string>('');

  const { sendToChatAssistant, loading: isLoadingChatAssistant } =
    useChatAssistant();

  useEffect(() => {
    if (votes.length === 0 || !isShowVotes) {
      setMessage('');
    }
  }, [votes, isShowVotes]);

  const isMobile = useIsMobile();
  if (isMobile) return null;

  const showZeClipado = votes.length > 0 && isShowVotes;

  const handleClick = () => {
    if (!votes || votes.length === 0) {
      return;
    }

    sendToChatAssistant(votes)
      .then((response) => {
        setMessage(response);
      })
      .catch((error) => {
        setMessage('Ops, algo deu errado. buguei!');
        console.error('Error sending votes to chat assistant:', error);
      });
  };

  return (
    <Container>
      {isLoadingChatAssistant && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      {message && (
        <div
          className="alert alert-light"
          style={{ margin: 0, marginRight: '-40px' }}
        >
          <Message>{message}</Message>
        </div>
      )}

      <StyledButton
        onClick={handleClick}
        $show={showZeClipado}
        title="Zé Clipado"
        disabled={isLoadingChatAssistant || !!message}
      >
        <StyledImage src={ZeClipadoPNG} alt="Zé Clipado" />
      </StyledButton>
    </Container>
  );
};

export default ZeClipado;
