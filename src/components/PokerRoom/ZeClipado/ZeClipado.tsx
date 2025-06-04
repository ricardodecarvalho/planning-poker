import styled from "styled-components";
import ZeClipadoPNG from "./assets/ze-clipado.png";
import { useIsMobile } from "../../../hooks/useIsMobile";

type ZeClipadoProps = {
  message: string;
  isLoading?: boolean;
};

const Container = styled.div`
  animation: fade-in 0.5s ease-in-out;
  padding: 0 30px 50px 0;
  display: flex;
  justify-content: center;
  align-items: center;
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

const ZeClipado = ({ message, isLoading }: ZeClipadoProps) => {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <Container className="position-absolute bottom-0 end-0">
      {isLoading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {message && (
        <div
          className="alert alert-light"
          style={{ margin: 0, marginRight: "-40px" }}
        >
          <Message>{message}</Message>
        </div>
      )}
      <StyledImage src={ZeClipadoPNG} alt="Zé Clipado" />
    </Container>
  );
};

export default ZeClipado;
