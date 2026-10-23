// Logo: un gato negro asomando, con la lengua fuera, sobre un cuadrado lavanda.
function Logo({ size = 48, text = false, className = "" }) {
  return (
    <span className={`logo${className ? ` ${className}` : ""}`}>
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        role="img"
        aria-label={text ? undefined : "Meal Planner"}
        aria-hidden={text ? "true" : undefined}
        focusable="false"
      >
        <defs>
          <clipPath id="logo-tile">
            <rect width="48" height="48" rx="14" />
          </clipPath>
        </defs>
        <rect width="48" height="48" rx="14" fill="#b8a9f3" />
        <g clipPath="url(#logo-tile)">
          <path d="M1 52C1 32 9 24 17 22.2 20 21.6 21 18 19.5 11.5L24 15.5 28.5 11.5C27 18 28 21.6 31 22.2 39 24 47 32 47 52Z" fill="#111113" />
          <path d="M16.6 28.2a3.4 3.4 0 0 1 6.8 0z" fill="#3a5aa8" />
          <path d="M16.6 28.2a3.4 3.4 0 0 0 6.8 0z" fill="#fff" />
          <path d="M24.6 28.2a3.4 3.4 0 0 1 6.8 0z" fill="#3a5aa8" />
          <path d="M24.6 28.2a3.4 3.4 0 0 0 6.8 0z" fill="#fff" />
          <path d="M21.5 32.2h5L24 35.6z" fill="#f78ac8" />
          <rect x="22.7" y="36.2" width="2.6" height="5" rx="1.3" fill="#f78ac8" />
          <g fill="none" stroke="#fff" strokeWidth="0.9" strokeLinecap="round">
            <path d="M19 36.5q2.6 2.2 5-.9q2.4 3.1 5 .9" />
            <path d="M6 28.5Q13 26.5 19.5 30.5M5 33.5Q12 31.5 19.5 33.6M7 38.6Q13 36 19.5 36.8" />
            <path d="M42 28.5Q35 26.5 28.5 30.5M43 33.5Q36 31.5 28.5 33.6M41 38.6Q35 36 28.5 36.8" />
          </g>
        </g>
      </svg>
      {text && <span className="logo__text">meal planner</span>}
    </span>
  );
}

export default Logo;
