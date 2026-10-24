import { useEffect, useRef } from "react";
import IconButton from "../IconButton";
import { CloseIcon } from "../Icons";

// Modal sobre <dialog> nativo: atrapa el foco, se cierra con Esc y devuelve el
// foco al elemento que lo abrió.
function Dialog({ titleId, onClose, className = "", children }) {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // El cierre nativo (Esc o close()) avisa por el evento `close`. Se escucha a
  // mano para soltarlo antes de cerrar al desmontar: en desarrollo React monta
  // y desmonta el efecto dos veces y ese evento tardío cerraría el diálogo.
  useEffect(() => {
    const dialog = ref.current;
    // Un `close` tardío con el diálogo ya reabierto no es un cierre real.
    const handleClose = () => {
      if (!dialog.open) onCloseRef.current();
    };
    dialog.addEventListener("close", handleClose);
    dialog.showModal();
    return () => {
      dialog.removeEventListener("close", handleClose);
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-labelledby={titleId}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="dialog__body">
        <IconButton label="Close" className="dialog__close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        {children}
      </div>
    </dialog>
  );
}

export default Dialog;
