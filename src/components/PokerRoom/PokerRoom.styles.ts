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
  height: 8rem;
  min-width: 4.8rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  cursor: pointer;
  background-color: #fff;
  padding: 0.5rem;
  margin: 0;
  transition: all 0.1s linear;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #212529;
    color: #fff;
    border-color: #212529;
  }

  ${({ checked }) => checked && "background-color: #007bff; color: #fff;"}
`;

export const VoteBadge = styled.span`
  width: 3rem;
`;

export const Results = styled.div`
  min-height: 20rem;
`;
