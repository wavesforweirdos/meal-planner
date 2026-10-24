const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export const PlusIcon = () => (
  <svg {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CloseIcon = () => (
  <svg {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const SearchIcon = () => (
  <svg {...base}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const FlameIcon = () => (
  <svg {...base} width={14} height={14}>
    <path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" />
  </svg>
);

export const ClockIcon = () => (
  <svg {...base} width={14} height={14}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const PeopleIcon = () => (
  <svg {...base} width={14} height={14}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 0 1 0 6M21 20c0-2.5-1.5-4.6-3.6-5.5" />
  </svg>
);

export const TagIcon = () => (
  <svg {...base} width={14} height={14}>
    <path d="M3 12V4h8l10 10-8 8L3 12z" />
    <circle cx="7.5" cy="8.5" r="1" />
  </svg>
);

export const CalendarIcon = () => (
  <svg {...base} width={24} height={24} strokeWidth={1.75}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const RecipeIcon = () => (
  <svg {...base} width={24} height={24} strokeWidth={1.75}>
    <path d="M6 14a4 4 0 0 1 1-7.9 5 5 0 0 1 9.8 1A4 4 0 0 1 18 14z" />
    <path d="M7 14v6h10v-6M7 17h10" />
  </svg>
);

export const CartIcon = () => (
  <svg {...base} width={24} height={24} strokeWidth={1.75}>
    <path d="M3 4h2.5l2.2 10.5h10.3L20 7H6.5" />
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="17" cy="19" r="1.5" />
  </svg>
);

export const GearIcon = () => (
  <svg {...base} width={20} height={20} strokeWidth={1.75}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);

export const TrashIcon = () => (
  <svg {...base} width={20} height={20} strokeWidth={1.75}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
  </svg>
);

// Un icono por franja del día.
const MEAL_ICON_PATHS = {
  // taza de café
  breakfast: (
    <>
      <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z" />
      <path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2M8 3v3M12 3v3" />
    </>
  ),
  // cubiertos
  lunch: (
    <>
      <path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10" />
      <path d="M17 21V3c-2.5 1.5-3.5 4-3.5 7.5V14H17" />
    </>
  ),
  // galleta
  snack: (
    <>
      <path d="M21 12a9 9 0 1 1-9-9 3.5 3.5 0 0 0 4 4 3.5 3.5 0 0 0 5 5z" />
      <path d="M9 10h.01M8 15h.01M13 14h.01M15 18h.01" />
    </>
  ),
  // luna
  dinner: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
};

export const MealIcon = ({ id }) => (
  <svg {...base} width={20} height={20} strokeWidth={1.75}>
    {MEAL_ICON_PATHS[id]}
  </svg>
);

export const CheckIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const CHEVRONS = {
  left: "M15 5l-7 7 7 7",
  right: "M9 5l7 7-7 7",
  up: "M5 15l7-7 7 7",
  down: "M5 9l7 7 7-7",
};

export const ChevronIcon = ({ dir = "right" }) => (
  <svg {...base} strokeWidth={1.75}>
    <path d={CHEVRONS[dir]} />
  </svg>
);

export const CopyIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" />
  </svg>
);

export const GridIcon = () => (
  <svg {...base} width={20} height={20} strokeWidth={1.75}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </svg>
);

export const CalendarPlusIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
  </svg>
);

export const SunIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
  </svg>
);

export const MoonIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
  </svg>
);

export const AutoIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor" />
  </svg>
);

export const PlateIcon = () => (
  <svg {...base} width={20} height={20} strokeWidth={1.75}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
  </svg>
);

// Emoji elegido por la persona, o el icono de su tipo (o un plato genérico).
export const MealGlyph = ({ meal }) =>
  meal.emoji ? (
    <span className="glyph" aria-hidden="true">
      {meal.emoji}
    </span>
  ) : MEAL_ICON_PATHS[meal.type] ? (
    <MealIcon id={meal.type} />
  ) : (
    <PlateIcon />
  );

export const InfoIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5" />
    <path d="M12 7.6v.01" strokeWidth={2.4} />
  </svg>
);

export const HeartIcon = ({ filled = false }) => (
  <svg {...base} strokeWidth={1.75} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />
  </svg>
);

export const LogoutIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <path d="M9 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H9" />
    <path d="M15 8l4 4-4 4M19 12H9" />
  </svg>
);

export const ArrowIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const HomeIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <path d="M4 11l8-7 8 7v8a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z" />
  </svg>
);

// Avatar por defecto: la silueta de persona de siempre.
export const PersonIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden="true" focusable="false">
    <circle cx="12" cy="8.5" r="4" />
    <path d="M1.5 24c0-5.6 4.7-9.5 10.5-9.5S22.500 18.400 22.500 24z" />
  </svg>
);

export const ShareIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" />
  </svg>
);

export const UsersIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.8c1.9.8 3 2.5 3 5.2" />
  </svg>
);

export const ImageIcon = () => (
  <svg {...base} strokeWidth={1.75}>
    <rect x="3.500" y="4.500" width="17" height="15" rx="3" />
    <circle cx="9" cy="10" r="1.600" />
    <path d="M4 17l5-4.500 3.500 3 3-2.500 4.500 4" />
  </svg>
);
