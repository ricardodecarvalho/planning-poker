import { useTranslation } from "react-i18n-lite";

import GlobeIcon from "../assets/images/globe.svg?react";
import EnFlag from "../assets/images/en-flag.svg?react";
import PtFlag from "../assets/images/pt-flag.svg?react";

type Type = {
  type: "button" | "link" | "select";
};

const ChangeLanguage = ({ type = "link" }: Type) => {
  const { language, setLanguage } = useTranslation();

  const handleChangeLanguage = (language: string) => {
    setLanguage(language);
  };

  if (type === "select") {
    return (
      <select
        className="form-select form-select-sm"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en-US">English</option>
        <option value="pt-BR">Português</option>
      </select>
    );
  }

  if (type === "button") {
    return (
      <button
        className="list-group-item list-group-item-action"
        onClick={() =>
          handleChangeLanguage(language === "en-US" ? "pt-BR" : "en-US")
        }
      >
        <div className="d-flex gap-2 align-items-center">
          <GlobeIcon />
          <span>
            {language === "en-US" ? (
              <PtFlag height={20} />
            ) : (
              <EnFlag height={20} />
            )}
          </span>
        </div>
      </button>
    );
  }

  return (
    <>
      {language === "en-US" && (
        <button
          className="btn btn-link"
          onClick={() => handleChangeLanguage("pt-BR")}
        >
          <GlobeIcon /> Português
        </button>
      )}

      {language === "pt-BR" && (
        <button
          className="btn btn-link"
          onClick={() => handleChangeLanguage("en-US")}
        >
          <GlobeIcon /> English
        </button>
      )}
    </>
  );
};

export default ChangeLanguage;
