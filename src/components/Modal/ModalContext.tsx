import React, { useState, createContext } from "react";
import { useTranslation } from "react-i18n-lite";

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
  undefined
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
        title={modalData?.title || ""}
        message={modalData?.message || ""}
        onConfirm={handleConfirm}
        onClose={closeModal}
        onConfirmButtonClass={modalData?.onConfirmButtonClass}
        onCloseButtonClass={modalData?.onCloseButtonClass}
        onConfirmButtonText={modalData?.onConfirmButtonText}
        onCloseButtonText={modalData?.onCloseButtonText}
      />
    </ModalContext.Provider>
  );
};

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  onCloseButtonClass?: string;
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
  onCloseButtonClass,
  onConfirmButtonClass,
  onCloseButtonText,
  onConfirmButtonText,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      tabIndex={-1}
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className={`btn ${onCloseButtonClass || "btn-secondary"}`}
              onClick={onClose}
            >
              {onCloseButtonText || t("modal.cancel")}
            </button>
            {onConfirm && (
              <button
                type="button"
                className={`btn ${onConfirmButtonClass || "btn-primary"}`}
                onClick={onConfirm}
              >
                {onConfirmButtonText || t("modal.confirm")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalProvider;
