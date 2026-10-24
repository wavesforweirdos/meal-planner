// Logo: la mascota (conejo). La forma es una máscara PNG, así que toma cualquier
// color. Formas: "min" (solo la cara; la mejor a tamaños pequeños), "full"
// (con la lista y el cuenco) y "horizontal" (mascota + nombre). Colores:
// "lilac", "lime" y "dark" sobre un cuadrado redondeado, o "plain" sin cuadrado.
// Tamaños: "sm", "md" y "lg". Todo el aspecto vive en la hoja de estilos.
const SHAPES = ["min", "full", "horizontal"];
const VARIANTS = ["lilac", "lime", "dark", "plain"];
const SIZES = ["sm", "md", "lg"];

function Logo({ size = "md", shape = "min", variant = "lilac", className = "" }) {
  const s = SHAPES.includes(shape) ? shape : "min";
  const v = VARIANTS.includes(variant) ? variant : "lilac";
  const z = SIZES.includes(size) ? size : "md";
  return (
    <span className={`logo logo--${z}${className ? ` ${className}` : ""}`}>
      <span
        className={`logo__tile logo__tile--${s} logo__tile--${v}`}
        role="img"
        aria-label="Meal Planner"
      >
        <span className="logo__mark" />
      </span>
    </span>
  );
}

export default Logo;
