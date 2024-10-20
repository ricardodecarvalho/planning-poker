import { useState } from "react";
import IconShare from "../assets/images/share.svg";

const Share = ({ roomId }: { roomId: string | undefined }) => {
  const [copied, setCopied] = useState(false);

  if (!roomId) {
    return null;
  }

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container d-flex justify-content-end">
        <div className="d-flex gap-2">
          <span className="navbar-text">Share this room</span>
          <button
            className="btn btn-light btn-sm"
            onClick={() => {
              navigator.clipboard
                .writeText(`${window.location.origin}/room/${roomId}`)
                .then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 3000);
                });
            }}
          >
            <img src={IconShare} alt="Share" />{" "}
            {copied && <span className="text-success">Copied!</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Share;
