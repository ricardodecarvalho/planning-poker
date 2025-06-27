import styled from "styled-components";
import ZeClipadoPNG from "./assets/ze-clipado.png";
import { useIsMobile } from "../../../hooks/useIsMobile";

type ZeClipadoProps = {
  message: string;
  isLoading: boolean;
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

const StyledImage = styled.img<{ $show: boolean }>`
  transform: translateY(${(p) => (p.$show ? "0" : "100%")});
  opacity: ${(p) => (p.$show ? 1 : 0)};
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;

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

  const showZeClipado = isLoading || !!message;

  return (
    <Container>
      {message && (
        <div
          className="alert alert-light"
          style={{ margin: 0, marginRight: "-40px" }}
        >
          <Message>{message}</Message>
        </div>
      )}
      <StyledImage src={ZeClipadoPNG} alt="Zé Clipado" $show={showZeClipado} />
    </Container>
  );
};

export default ZeClipado;
