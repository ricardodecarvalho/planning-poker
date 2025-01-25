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
  font-size: 2rem;
  height: 4.8rem;
  min-width: 4.8rem;
  cursor: pointer;
  transition: all 0.1s linear;
  align-items: center;
  justify-content: center;

  ${({ checked }) => checked && "background-color: #007bff; color: #fff;"}
`;

export const VoteBadge = styled.span`
  width: 3rem;
`;

export const Results = styled.div`
  min-height: 20rem;
`;
