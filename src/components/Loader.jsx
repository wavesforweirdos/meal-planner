// Mascota animada de carga. Son 60 fotogramas en una cuadrícula de 10×6 (public/loader-sheet.webp)
// usada como máscara, así que el color sigue al tema (oscuro en claro, blanco en
// oscuro). Con "reducir movimiento" se queda en un solo fotograma.
const BASE = import.meta.env.BASE_URL;

function Loader({ size = "md", label = "Loading", fullscreen = false }) {
  const mascot = <span className={`loader loader--${size}`} role="status" aria-label={label} />;
  return fullscreen ? <div className="loader-screen">{mascot}</div> : mascot;
}

export default Loader;
