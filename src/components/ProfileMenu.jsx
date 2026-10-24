import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Avatar from "./Avatar";
import InfoPopover from "./InfoPopover";
import IconButton from "./IconButton";
import { AVATARS, imageToAvatar } from "../utils/avatars";
import { CloseIcon, ImageIcon, LogoutIcon } from "./Icons";

// Avatar del perfil activo con un pequeño menú para cerrar sesión.
function ProfileMenu() {
  const { user, signOut, setAvatar } = useContext(AuthContext);
  const fileRef = useRef(null);
  const [error, setError] = useState("");
  if (!user) return null;

  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setError("");
      setAvatar(await imageToAvatar(file));
    } catch {
      setError("That file is not an image.");
    }
  };

  return (
    <InfoPopover
      label={`Account: ${user.name}`}
      icon={<Avatar user={user} size="fill" />}
      tooltip="custom"
      buttonClass="profile-btn"
      panelClass="profile-panel"
    >
      <p className="profile-panel__name">
        <span className="profile-panel__me">
          <Avatar user={user} size="md" />
          {user.custom && (
            <IconButton
              label={user.hasPhoto ? "Use my account photo" : "Remove avatar"}
              className="icon-btn--small profile-panel__remove"
              onClick={() => setAvatar(user.hasPhoto ? "" : "none")}
            >
              <CloseIcon />
            </IconButton>
          )}
        </span>
        <span>
          <span className="profile-panel__hint">Signed in as</span>
          <strong>{user.name}</strong>
        </span>
      </p>
      <div className="profile-panel__avatars" role="group" aria-label="Choose your avatar">
        {AVATARS.map((a) => (
          <button
            key={a}
            type="button"
            className="glyph"
            aria-pressed={user.emoji === a}
            aria-label={`Avatar ${a}`}
            onClick={() => setAvatar(a)}
          >
            {a}
          </button>
        ))}
        <input
          className="profile-panel__custom"
          aria-label="Use any other emoji"
          placeholder="Any emoji"
          maxLength={8}
          value={AVATARS.includes(user.emoji) ? "" : user.emoji}
          onChange={(e) => setAvatar(e.target.value.trim() || "none")}
        />
        <IconButton label="Upload your own picture" className="icon-btn--small" onClick={() => fileRef.current?.click()}>
          <ImageIcon />
        </IconButton>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={upload} />
      </div>
      {error && (
        <p className="notice profile-panel__error" role="alert">
          {error}
        </p>
      )}
      <IconButton label="Sign out" variant="dark" className="profile-panel__out" onClick={signOut}>
        <LogoutIcon />
      </IconButton>
    </InfoPopover>
  );
}

export default ProfileMenu;
