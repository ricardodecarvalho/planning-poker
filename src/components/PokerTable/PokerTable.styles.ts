import styled from "styled-components";

export const TableContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50vh;
  min-height: 400px;
  max-height: 600px;
  position: relative;
  overflow: hidden;

  @media (max-height: 768px) {
    height: 40vh;
    min-height: 300px;
  }

  @media (max-width: 768px) {
    height: 45vh;
    min-height: 350px;
  }
`;

export const Table = styled.div`
  width: 80%;
  height: 60%;
  background-color: #35654d;
  border: 15px solid #5c4033;
  border-radius: 200px;
  position: relative;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5), 0 10px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CenterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  z-index: 10;
  font-size: clamp(0.875rem, 2vw, 1rem);
  gap: 0.5rem;
`;

export const AverageValue = styled.div`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: bold;
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 50%;
  width: clamp(80px, 15vw, 100px);
  height: clamp(80px, 15vw, 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

export const Seat = styled.div<{ $angle: number; $distance: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(${props => props.$angle}deg) translate(${props => props.$distance}px) rotate(-${props => props.$angle}deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: clamp(60px, 10vw, 80px);
  z-index: 20;
`;

export const PlayerName = styled.span`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: clamp(0.65rem, 1.5vw, 0.8rem);
  margin-top: 5px;
  white-space: nowrap;
  max-width: clamp(80px, 15vw, 100px);
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardBack = styled.div`
  width: 30px;
  height: 42px;
  background-color: #b71c1c;
  border: 2px solid white;
  border-radius: 4px;
  margin-top: 5px;
  background-image: repeating-linear-gradient(
    45deg,
    #b71c1c,
    #b71c1c 5px,
    #c62828 5px,
    #c62828 10px
  );
`;

export const VoteValue = styled.div`
  width: 30px;
  height: 42px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #333;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;


