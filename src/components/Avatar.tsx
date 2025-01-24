import { Participant } from "../hooks/useParticipants";
import { UserColorScheme } from "../util";

const initials = (displayName: string) => {
  return displayName
    .split(" ")
    .map((name) => name[0])
    .join("");
};

const classes = (colorScheme: UserColorScheme) => {
  return ` ${colorScheme?.bg} ${colorScheme?.text}`;
};

const Avatar = ({ photoURL, displayName, colorScheme }: Participant) => {
  if (!photoURL && displayName) {
    return (
      <span
        title={displayName || ""}
        className={`rounded-circle me-2 border border-2 border-white ${classes(
          colorScheme
        )} d-flex justify-content-center align-items-center`}
        style={{
          width: 32,
          height: 32,
          fontSize: 12,
          fontWeight: "bold",
          cursor: "default",
        }}
      >
        {initials(displayName)}
      </span>
    );
  }

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt=""
        width="32"
        height="32"
        className="rounded-circle me-2 border border-2 border-white"
        title={displayName || ""}
      />
    );
  }

  return null;
};

export default Avatar;
