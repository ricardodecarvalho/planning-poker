import React, { useState, createContext } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18n-lite';
import Button from '../ui/Button';

interface ModalData {
  title: string;
  message: string;
  onClose?: () => void;
  onConfirm?: () => void;
  onCloseButtonClass?: string;
  onConfirmButtonClass?: string;
  onCloseButtonText?: string;
  onConfirmButtonText?: string;
}

export interface ModalContextProps {
  showModal: (data: ModalData) => void;
  closeModal: () => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalContext = createContext<ModalContextProps | undefined>(
  undefined,
);

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const showModal = (data: ModalData) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (modalData?.onConfirm) modalData.onConfirm();
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    if (modalData?.onClose) modalData.onClose();
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      <Modal
        isOpen={isModalOpen}
        title={modalData?.title || ''}
        message={modalData?.message || ''}
        onConfirm={handleConfirm}
        onClose={closeModal}
        onConfirmButtonClass={modalData?.onConfirmButtonClass}
        onConfirmButtonText={modalData?.onConfirmButtonText}
        onCloseButtonText={modalData?.onCloseButtonText}
      />
    </ModalContext.Provider>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1080;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--surface-overlay);
  backdrop-filter: blur(2px);
  animation: ppFade var(--duration-base) var(--ease-out);
`;

const Dialog = styled.div`
  width: 100%;
  max-width: 440px;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  animation: ppRise var(--duration-base) var(--ease-out);
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px;
  border-bottom: 1px solid var(--border-subtle);

  h2 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.01em;
  }
`;

const CloseButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-colors);

  &:hover {
    background: var(--fill-hover);
    color: var(--text-primary);
  }
`;

const Body = styled.div`
  padding: 22px;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.55;
`;

const Foot = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 22px;
  border-top: 1px solid var(--border-subtle);
`;

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  onConfirmButtonClass?: string;
  onCloseButtonText?: string;
  onConfirmButtonText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  onConfirmButtonClass,
  onCloseButtonText,
  onConfirmButtonText,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const confirmVariant = onConfirmButtonClass?.includes('danger')
    ? 'danger'
    : 'primary';

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Head>
          <h2>{title}</h2>
          <CloseButton onClick={onClose} aria-label="Close">
            <X size={20} />
          </CloseButton>
        </Head>
        <Body>{message}</Body>
        <Foot>
          <Button variant="secondary" onClick={onClose}>
            {onCloseButtonText || t('modal.cancel')}
          </Button>
          {onConfirm && (
            <Button variant={confirmVariant} onClick={onConfirm}>
              {onConfirmButtonText || t('modal.confirm')}
            </Button>
          )}
        </Foot>
      </Dialog>
    </Overlay>
  );
};

export default ModalProvider;
