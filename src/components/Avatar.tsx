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

interface AvatarProps extends Participant {
  isShowState?: boolean;
}

const Avatar = ({
  photoURL,
  displayName,
  colorScheme,
  state,
  isShowState = true,
}: AvatarProps) => {
  const isOnline = state === "online";
  const bg = isOnline ? "bg-success" : "bg-danger";

  if (!photoURL && displayName) {
    return (
      <span
        title={displayName || ""}
        className={`rounded-circle me-2 border border-2 border-white ${classes(
          colorScheme
        )} d-flex justify-content-center align-items-center position-relative`}
        style={{
          width: 32,
          height: 32,
          fontSize: 12,
          fontWeight: "bold",
        }}
      >
        {initials(displayName)}
        {isShowState && (
          <span
            className={`position-absolute p-1 ${bg} rounded-circle border border-1 border-white`}
            style={{ bottom: -2, right: -2 }}
          >
            <span className="visually-hidden">User state</span>
          </span>
        )}
      </span>
    );
  }

  if (photoURL) {
    return (
      <div
        className="position-relative me-2"
        style={{
          width: 32,
          height: 32,
          fontSize: 12,
          fontWeight: "bold",
        }}
      >
        <img
          src={photoURL}
          alt=""
          width="32"
          height="32"
          className="rounded-circle me-2 border border-2 border-white"
          title={displayName || ""}
        />
        {isShowState && (
          <span
            className={`position-absolute p-1 ${bg} rounded-circle border border-1 border-white`}
            style={{ bottom: 0, right: 0 }}
          >
            <span className="visually-hidden">User state</span>
          </span>
        )}
      </div>
    );
  }

  return null;
};

export default Avatar;
