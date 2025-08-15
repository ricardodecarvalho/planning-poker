import styled from "styled-components";

export const Board = styled.div`
  display: flex;
  gap: 16px;
  min-height: 400px;
`;

export const Column = styled.ol`
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  min-height: 200px;
  background-color: #f8f9fa;
  border: 2px dashed transparent;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: #dee2e6;
  }
`;

export const Card = styled.li`
  cursor: grab;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  &:active {
    cursor: grabbing;
  }
`;
