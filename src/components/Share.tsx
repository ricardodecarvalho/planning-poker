import { useState } from "react";
import ContentCopyIcon from "../assets/images/content_copy.svg";
import CheckIcon from "../assets/images/check.svg";

const Share = ({ roomId }: { roomId: string | undefined }) => {
  const [copied, setCopied] = useState(false);

  if (!roomId) {
    return null;
  }

  return (
    <div className="d-flex justify-content-end gap-2">
      <span className="navbar-text">
        Copy and share this link with your friends
      </span>
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
        {!copied && <img src={ContentCopyIcon} alt="Share icon" />}

        {copied && (
          <>
            <img src={CheckIcon} alt="Copied icon" />{" "}
            <span className="text-success">Copied!</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Share;
