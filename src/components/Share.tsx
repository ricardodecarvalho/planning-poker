import { useState } from 'react';
import styled from 'styled-components';

import ContentCopyIcon from '../assets/images/content_copy.svg?react';
import CheckIcon from '../assets/images/check.svg?react';
import { useTranslation } from 'react-i18n-lite';

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

interface ShareProps {
  roomId: string | undefined;
  message?: string;
  label?: string;
}

const Share = ({
  roomId,
  message = 'Copy and share this link with your friends',
  label,
}: ShareProps) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  if (!roomId) {
    return null;
  }

  return (
    <div className="d-flex justify-content-end gap-2">
      <span className="navbar-text">{message}</span>
      <Button
        title={t('rooms.copyRoomUrl')}
        onClick={() => {
          navigator.clipboard
            .writeText(`${window.location.origin}/room/${roomId}`)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 3000);
            });
        }}
      >
        {label && `${label} `}

        {!copied && <ContentCopyIcon />}

        {copied && (
          <>
            <CheckIcon />{' '}
            <span className="text-success">{t('rooms.urlCopied')}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default Share;
