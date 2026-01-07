import styled from "styled-components";

export const HorizontalContainer = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  padding: 1.5rem;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

export const CardContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--bs-body-bg);
  z-index: 1000;
`;

export const PokerTableContainer = styled.div``;

export const Card = styled.button<{ checked: boolean }>`
  display: flex;
  font-size: 1.5rem;
  height: 7rem;
  min-width: 4.8rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  align-items: center;
  justify-content: center;
  position: relative;
  transform: translateY(0);

  ${({ checked }) => checked && `
    background-color: #0056b3;
    color: #fff;
    transform: translateY(-8px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  `}

  &:hover:not(:disabled) {
    background-color: ${({ checked }) => checked ? "#0056b3" : "var(--bs-secondary-bg)"};
    transform: translateY(-8px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

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
