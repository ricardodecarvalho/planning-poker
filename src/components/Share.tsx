import { useState } from "react";
import ContentCopyIcon from "../assets/images/content_copy.svg";
import CheckIcon from "../assets/images/check.svg";

interface ShareProps {
  roomId: string | undefined;
  message?: string;
  label?: string;
}

const Share = ({
  roomId,
  message = "Copy and share this link with your friends",
  label,
}: ShareProps) => {
  const [copied, setCopied] = useState(false);

  if (!roomId) {
    return null;
  }

  return (
    <div className="d-flex justify-content-end gap-2">
      <span className="navbar-text">{message}</span>
      <button
        className="btn btn-light"
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

        {!copied && (
          <img src={ContentCopyIcon} alt="Share icon" title="Copy room URL" />
        )}

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
