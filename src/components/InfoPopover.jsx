import { useEffect, useId, useRef, useState } from "react";
import IconButton from "./IconButton";
import { InfoIcon } from "./Icons";

// Icono "i": el texto de ayuda solo aparece al pulsarlo (y se cierra con Esc,
// al pulsar fuera o al volver a pulsar el icono).
function InfoPopover({
  label,
  children,
  icon = <InfoIcon />,
  buttonClass = "info__btn",
  panelClass = "info__panel",
  tooltip,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        wrapRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="info" ref={wrapRef}>
      <IconButton
        label={label}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        className={buttonClass}
        tooltip={tooltip}
        onClick={() => setOpen((v) => !v)}
      >
        {icon}
      </IconButton>
      {open && (
        <div id={id} className={panelClass} role="region" aria-label={label}>
          {children}
        </div>
      )}
    </div>
  );
}

export default InfoPopover;
