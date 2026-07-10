import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Wifi, WifiOff } from 'lucide-react';

const Banner = styled.div<{ $tone: 'danger' | 'success' }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  animation: ppFade var(--duration-base) var(--ease-out);
  color: ${({ $tone }) =>
    $tone === 'danger' ? 'var(--danger)' : 'var(--success)'};
  background: ${({ $tone }) =>
    $tone === 'danger' ? 'var(--danger-bg)' : 'var(--success-bg)'};
  border-bottom: 1px solid
    ${({ $tone }) =>
      $tone === 'danger' ? 'var(--danger-border)' : 'var(--success-border)'};
`;

const ConnectionAlert = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <Banner $tone="danger" role="alert">
        <WifiOff size={18} />
        <span>You are offline. Please check your internet connection.</span>
      </Banner>
    );
  }

  if (showReconnected) {
    return (
      <Banner $tone="success" role="alert">
        <Wifi size={18} />
        <span>Connection restored!</span>
      </Banner>
    );
  }

  return null;
};

export default ConnectionAlert;
