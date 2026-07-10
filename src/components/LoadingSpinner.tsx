import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 48px 0;
`;

const Spinner = styled.span`
  width: 34px;
  height: 34px;
  border: 3px solid var(--border);
  border-top-color: var(--brand-primary);
  border-radius: 50%;
  animation: ppSpin 0.7s linear infinite;
`;

const LoadingSpinner = () => {
  return (
    <Wrap role="status">
      <Spinner />
      <span className="visually-hidden">Loading...</span>
    </Wrap>
  );
};

export default LoadingSpinner;
