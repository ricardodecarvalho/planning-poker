import { useTranslation } from "react-i18n-lite";

interface OffcanvasProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Offcanvas = ({ children, onClose, isOpen }: OffcanvasProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div
        className={`offcanvas offcanvas-end ${isOpen ? "fade show" : ""}`}
        tabIndex={-1}
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasRightLabel">
            {t("navbar.userSettings")}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        <div className="offcanvas-body">{children}</div>
      </div>
      <div 
        className={`${isOpen ? "offcanvas-backdrop fade show" : ""}`} 
        onClick={onClose}
      />
    </>
  );
};

export default Offcanvas;
