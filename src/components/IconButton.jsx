// Botón redondo solo con icono. El nombre accesible (y el tooltip) va en `label`.
function IconButton({
  label,
  children,
  variant = "plain",
  className = "",
  type = "button",
  tooltip = "native",
  ...props
}) {
  return (
    <button
      type={type}
      className={`icon-btn icon-btn--${variant}${className ? ` ${className}` : ""}`}
      aria-label={label}
      title={tooltip === "native" ? label : undefined}
      data-tip={tooltip === "custom" ? label : undefined}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
