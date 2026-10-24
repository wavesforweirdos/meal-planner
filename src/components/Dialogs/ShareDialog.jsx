import { useContext, useState } from "react";
import { PlannerContext } from "../../context/PlannerContext";
import { inviteLink, sharingIsLocal } from "../../utils/sharing";
import IconButton from "../IconButton";
import { CheckIcon, CopyIcon, LogoutIcon, ShareIcon, UsersIcon } from "../Icons";
import Dialog from "./Dialog";

// Compartir el plan con otras personas: todas editan el mismo plan y la misma
// lista de la compra, y los cambios se ven al momento.
function ShareDialog({ onClose }) {
  const { shareId, shareInfo, startShare, leaveShare } = useContext(PlannerContext);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const link = shareId ? inviteLink(shareId) : "";

  const start = async () => {
    setBusy(true);
    setError("");
    try {
      await startShare();
    } catch {
      setError("Could not start sharing. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      document.getElementById("share-link")?.select();
    }
  };

  return (
    <Dialog titleId="share-title" onClose={onClose} className="dialog--small">
      <h2 id="share-title" className="recipe-detail__title">
        Share this plan
      </h2>

      {!shareId ? (
        <>
          <p className="share__text">
            Invite people to plan together: everyone edits the same week and the
            same shopping list, and changes show up for all of you right away.
          </p>
          {sharingIsLocal && (
            <p className="notice">
              Demo mode: sharing works between tabs of this browser. With Firebase
              configured it works between devices.
            </p>
          )}
          {error && (
            <p className="notice" role="alert">
              {error}
            </p>
          )}
          <div className="add-form__actions">
            <IconButton label="Start sharing" variant="dark" disabled={busy} onClick={start}>
              <ShareIcon />
            </IconButton>
          </div>
        </>
      ) : (
        <>
          <p className="share__text">
            Anyone who is signed in and opens this link can join and edit.
          </p>
          <div className="share__link">
            <input
              id="share-link"
              readOnly
              value={link}
              aria-label="Invitation link"
              onFocus={(e) => e.target.select()}
            />
            <IconButton
              label={copied ? "Link copied" : "Copy link"}
              variant="dark"
              onClick={copy}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </IconButton>
          </div>
          <p className="visually-hidden" role="status">
            {copied ? "Link copied to the clipboard." : ""}
          </p>

          <div className="share__members">
            <p className="share__label">
              <UsersIcon /> {shareInfo.members.length || 1}{" "}
              {shareInfo.members.length === 1 ? "person" : "people"}
            </p>
            <ul className="chips">
              {shareInfo.members.map((name, i) => (
                <li key={`${name}-${i}`} className="chip">
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div className="add-form__actions">
            <IconButton
              label="Stop sharing and keep a copy"
              onClick={async () => {
                await leaveShare();
                onClose();
              }}
            >
              <LogoutIcon />
            </IconButton>
            <IconButton label="Done" variant="dark" onClick={onClose}>
              <CheckIcon />
            </IconButton>
          </div>
          <p className="settings__hint">
            Leaving keeps your own copy of the plan; the others keep editing theirs.
          </p>
        </>
      )}
    </Dialog>
  );
}

export default ShareDialog;
