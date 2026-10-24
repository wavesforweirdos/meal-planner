import { PersonIcon } from "./Icons";

// Emoji elegido, foto de la cuenta o, por defecto, la silueta de persona.
function Avatar({ user, size = "md" }) {
  return (
    <span className={`avatar-badge avatar-badge--${size}`} aria-hidden="true">
      {user?.photo ? (
        <img className="avatar" src={user.photo} alt="" referrerPolicy="no-referrer" />
      ) : user?.emoji ? (
        <span className="glyph">{user.emoji}</span>
      ) : (
        <PersonIcon />
      )}
    </span>
  );
}

export default Avatar;
