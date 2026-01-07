import { useTranslation } from "react-i18n-lite";
import { ViewType } from "../hooks/useViewPreference";

interface ViewToggleProps {
  viewType: ViewType;
  onToggle: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewType, onToggle }) => {
  const { t } = useTranslation();

  return (
    <div className="btn-group" role="group">
      <button
        type="button"
        className={`btn btn-sm ${viewType === "table" ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => viewType !== "table" && onToggle()}
        title={t("viewToggle.tableView")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <ellipse cx="8" cy="8" rx="7" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        </svg>
        <span className="ms-1 d-none d-md-inline">{t("viewToggle.table")}</span>
      </button>
      <button
        type="button"
        className={`btn btn-sm ${viewType === "list" ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => viewType !== "list" && onToggle()}
        title={t("viewToggle.listView")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
        <span className="ms-1 d-none d-md-inline">{t("viewToggle.list")}</span>
      </button>
    </div>
  );
};

export default ViewToggle;
