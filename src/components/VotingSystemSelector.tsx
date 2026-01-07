import { useState, useRef, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { VOTING_SYSTEMS, VotingSystemType } from "../types/votingSystems";
import { useTranslation } from "react-i18n-lite";
import { toast } from "react-toastify";

interface VotingSystemSelectorProps {
  roomId: string;
  currentSystem: VotingSystemType;
  hasActiveVotes: boolean;
}

const VotingSystemSelector: React.FC<VotingSystemSelectorProps> = ({
  roomId,
  currentSystem,
  hasActiveVotes,
}) => {
  const { t } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSystemChange = async (systemId: VotingSystemType) => {
    if (systemId === currentSystem || isChanging || hasActiveVotes) return;

    if (hasActiveVotes) {
      toast.warning(t("votingSystem.cannotChangeWithActiveVotes"));
      setIsOpen(false);
      return;
    }

    try {
      setIsChanging(true);
      setIsOpen(false);
      const roomRef = doc(firestore, "rooms", roomId);
      await updateDoc(roomRef, {
        votingSystem: systemId,
      });
      toast.success(t("votingSystem.changed"));
    } catch (error) {
      console.error("Error updating voting system:", error);
      toast.error(t("votingSystem.errorChanging"));
    } finally {
      setIsChanging(false);
    }
  };

  const handleButtonClick = () => {
    if (hasActiveVotes) {
      toast.warning(t("votingSystem.cannotChangeWithActiveVotes"));
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="btn btn-outline-secondary dropdown-toggle"
        type="button"
        onClick={handleButtonClick}
        disabled={isChanging || hasActiveVotes}
        title={hasActiveVotes ? t("votingSystem.cannotChangeWithActiveVotes") : ""}
      >
        {VOTING_SYSTEMS[currentSystem].name}
      </button>
      <ul className={`dropdown-menu ${isOpen ? "show" : ""}`}>
        {Object.values(VOTING_SYSTEMS).map((system) => (
          <li key={system.id}>
            <button
              className={`dropdown-item ${system.id === currentSystem ? "active" : ""}`}
              onClick={() => handleSystemChange(system.id)}
              disabled={system.id === currentSystem}
            >
              {system.name}
              <div className="text-muted small">
                {system.values.slice(0, 6).join(", ")}...
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotingSystemSelector;
