import styled from "styled-components";

export const HorizontalContainer = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  gap: 1rem;
  width: 100%;
`;

export const Card = styled.button<{ checked: boolean }>`
  display: flex;
  font-size: 1.5rem;
  height: 7rem;
  min-width: 4.8rem;
  cursor: pointer;
  transition: all 0.1s linear;
  align-items: center;
  justify-content: center;
  position: relative;

  ${({ checked }) => checked && "background-color: #007bff; color: #fff;"}

  .corner-top-left {
    position: absolute;
    top: 0.2rem;
    left: 0.4rem;
    font-size: 0.8rem;
  }

  .corner-bottom-right {
    position: absolute;
    bottom: 0.2rem;
    right: 0.4rem;
    font-size: 0.8rem;
    transform: rotate(180deg);
  }
`;

export const VoteBadge = styled.span`
  width: 3rem;
`;

export const Results = styled.div`
  min-height: 20rem;
`;
