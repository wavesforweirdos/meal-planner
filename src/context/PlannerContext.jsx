import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { canonical, sharingBackend, slimPlan } from "../utils/sharing";
import { MEALS } from "../utils/recipe";
import { readJSON, writeJSON } from "../utils/storage";
import { userKey } from "../utils/session";

export const PlannerContext = createContext();

// Cada perfil guarda lo suyo (ver utils/session.js).
const PLAN_KEY = "plan";
const CHECKED_KEY = "checked";
const SETTINGS_KEY = "settings";

export const THEMES = ["system", "light", "dark"];
export const MAX_MEALS = 8;
const COLORS = ["breakfast", "lunch", "snack", "dinner"];

// Comidas de serie. `type` sirve para filtrar recetas y elegir el icono cuando
// no hay emoji; `color` es uno de los colores de franja.
export const DEFAULT_MEALS = MEALS.map((m) => ({
  id: m.id,
  label: m.label,
  emoji: "",
  type: m.id,
  color: m.id,
}));

export const DEFAULT_SETTINGS = {
  meals: DEFAULT_MEALS,
  perSlot: 3,
  theme: "system",
};

const emptyPlan = () => Array.from({ length: 7 }, () => ({}));

// El plan guarda, por día, las recetas de cada comida (clave = id de la comida).
const isValidPlan = (plan) =>
  Array.isArray(plan) &&
  plan.length === 7 &&
  plan.every(
    (day) =>
      day &&
      typeof day === "object" &&
      Object.values(day).every((list) => Array.isArray(list))
  );

const cleanMeal = (m, index) => ({
  id: String(m.id),
  label: String(m.label ?? "").slice(0, 24),
  emoji: String(m.emoji ?? "").slice(0, 8),
  type: [...COLORS, "other"].includes(m.type) ? m.type : "other",
  color: COLORS.includes(m.color) ? m.color : COLORS[index % COLORS.length],
});

function loadSettings() {
  const saved = readJSON(userKey(SETTINGS_KEY), null);
  let meals = DEFAULT_MEALS;
  if (Array.isArray(saved?.meals) && saved.meals.length) {
    if (typeof saved.meals[0] === "string") {
      // Formato anterior: lista de ids de las comidas visibles.
      const kept = DEFAULT_MEALS.filter((m) => saved.meals.includes(m.id));
      if (kept.length) meals = kept;
    } else {
      const valid = saved.meals.filter((m) => m && m.id).slice(0, MAX_MEALS);
      if (valid.length) meals = valid.map(cleanMeal);
    }
  }
  const perSlot = Number(saved?.perSlot);
  return {
    meals,
    perSlot: [1, 2, 3].includes(perSlot) ? perSlot : DEFAULT_SETTINGS.perSlot,
    theme: THEMES.includes(saved?.theme) ? saved.theme : DEFAULT_SETTINGS.theme,
  };
}

// Número de semana ISO (la semana del jueves de esa semana).
function isoWeek(monday) {
  const thursday = new Date(monday);
  thursday.setDate(monday.getDate() + 3);
  const yearStart = new Date(thursday.getFullYear(), 0, 1);
  return Math.ceil(((thursday - yearStart) / 86400000 + 1) / 7);
}

// Semana actual de lunes a domingo.
function getWeek() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      index: i,
      week: isoWeek(monday),
      short: date.toLocaleDateString("en-US", { weekday: "short" }),
      long: date.toLocaleDateString("en-US", { weekday: "long" }),
      month: date.toLocaleDateString("en-US", { month: "long" }),
      monthShort: date.toLocaleDateString("en-US", { month: "short" }),
      num: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    };
  });
}

export function PlannerContextProvider({ children }) {
  const week = useMemo(getWeek, []);
  const [plan, setPlan] = useState(() => {
    const saved = readJSON(userKey(PLAN_KEY), null);
    return isValidPlan(saved) ? saved : emptyPlan();
  });
  const [checked, setChecked] = useState(() => readJSON(userKey(CHECKED_KEY), []));
  const [settings, setSettings] = useState(loadSettings);
  const [announcement, setAnnouncement] = useState("");
  const { user } = useContext(AuthContext);

  //------------------- Plan compartido -------------------//
  // Con un plan compartido, plan, lista de la compra y comidas viven en un
  // documento común que todos los miembros ven y editan en tiempo real.
  const [shareId, setShareIdState] = useState(() => readJSON(userKey("share"), null));
  const [shareInfo, setShareInfo] = useState({ members: [], owner: "" });
  const lastSync = useRef("");

  const setShareId = (id) => {
    setShareIdState(id);
    writeJSON(userKey("share"), id);
  };

  useEffect(() => writeJSON(userKey(PLAN_KEY), plan), [plan]);
  useEffect(() => writeJSON(userKey(CHECKED_KEY), checked), [checked]);
  useEffect(() => writeJSON(userKey(SETTINGS_KEY), settings), [settings]);

  const syncContent = (plan, checked, meals, perSlot) =>
    canonical({ plan: slimPlan(plan), checked, meals, perSlot });

  // Cambios de otras personas: llegan y sustituyen lo local.
  useEffect(() => {
    if (!shareId) return undefined;
    return sharingBackend.subscribe(shareId, (doc) => {
      if (!doc) {
        // El plan dejó de existir o ya no eres miembro: se conserva tu copia.
        setShareId(null);
        return;
      }
      setShareInfo({
        members: doc.members.map((m) => doc.names?.[m] ?? "Someone"),
        owner: doc.names?.[doc.owner] ?? "",
      });
      const incoming = canonical({
        plan: doc.plan,
        checked: doc.checked ?? [],
        meals: doc.meals,
        perSlot: doc.perSlot,
      });
      if (incoming === lastSync.current) return;
      lastSync.current = incoming;
      setPlan(doc.plan);
      setChecked(doc.checked ?? []);
      setSettings((cur) => ({ ...cur, meals: doc.meals, perSlot: doc.perSlot }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareId]);

  // Cambios propios: se envían (con una pequeña espera para agruparlos).
  useEffect(() => {
    if (!shareId) return undefined;
    const content = syncContent(plan, checked, settings.meals, settings.perSlot);
    if (content === lastSync.current) return undefined;
    const timer = setTimeout(() => {
      lastSync.current = content;
      sharingBackend.write(shareId, {
        ...JSON.parse(content),
        updatedBy: user?.id ?? "",
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [plan, checked, settings.meals, settings.perSlot, shareId, user]);

  const startShare = async () => {
    const content = JSON.parse(syncContent(plan, checked, settings.meals, settings.perSlot));
    const id = await sharingBackend.create({
      ...content,
      owner: user.id,
      members: [user.id],
      names: { [user.id]: user.name },
      updatedBy: user.id,
    });
    lastSync.current = canonical(content);
    setShareId(id);
    return id;
  };

  const joinShare = async (id) => {
    const ok = await sharingBackend.join(id, user.id, user.name);
    if (ok) setShareId(id);
    return ok;
  };

  const leaveShare = async () => {
    const id = shareId;
    setShareId(null);
    setShareInfo({ members: [], owner: "" });
    if (id) await sharingBackend.leave(id, user.id);
  };

  // "system" deja que mande prefers-color-scheme; los otros fuerzan el tema.
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "system") delete root.dataset.theme;
    else root.dataset.theme = settings.theme;
    // Al cerrar sesión, la pantalla de bienvenida vuelve a seguir al sistema.
    return () => {
      delete root.dataset.theme;
    };
  }, [settings.theme]);

  const activeMeals = settings.meals;
  const maxPerSlot = settings.perSlot;
  const slotOf = (dayIndex, mealId) => plan[dayIndex][mealId] ?? [];
  const mealLabel = (mealId) =>
    activeMeals.find((m) => m.id === mealId)?.label || "meal";

  const updateSettings = (patch) =>
    setSettings((current) => ({ ...current, ...patch }));

  //------------------- Comidas personalizables -------------------//

  const updateMeal = (id, patch) =>
    setSettings((current) => ({
      ...current,
      meals: current.meals.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));

  const addMeal = () =>
    setSettings((current) => {
      if (current.meals.length >= MAX_MEALS) return current;
      const n = current.meals.length;
      return {
        ...current,
        meals: [
          ...current.meals,
          {
            id: `m${Date.now().toString(36)}`,
            label: `Meal ${n + 1}`,
            emoji: "🍽️",
            type: "other",
            color: COLORS[n % COLORS.length],
          },
        ],
      };
    });

  const removeMeal = (id) =>
    setSettings((current) =>
      current.meals.length <= 1
        ? current
        : { ...current, meals: current.meals.filter((m) => m.id !== id) }
    );

  const moveMeal = (id, delta) =>
    setSettings((current) => {
      const from = current.meals.findIndex((m) => m.id === id);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= current.meals.length) return current;
      const meals = [...current.meals];
      [meals[from], meals[to]] = [meals[to], meals[from]];
      return { ...current, meals };
    });

  //------------------- Plan -------------------//

  // Devuelve "added" | "full" | "duplicate" para que quien llama pueda avisar.
  const addToSlot = (dayIndex, mealId, recipe) => {
    const slot = slotOf(dayIndex, mealId);
    const label = `${week[dayIndex].long} ${mealLabel(mealId)}`;
    const title = recipe.title;
    if (slot.some((r) => r.id === recipe.id)) {
      setAnnouncement(`${title} is already in ${label}.`);
      return "duplicate";
    }
    if (slot.length >= maxPerSlot) {
      setAnnouncement(`${label} is full (${maxPerSlot} recipes maximum).`);
      return "full";
    }
    setPlan((current) =>
      current.map((day, i) =>
        i === dayIndex
          ? { ...day, [mealId]: [...(day[mealId] ?? []), recipe] }
          : day
      )
    );
    setAnnouncement(`${title} added to ${label}.`);
    return "added";
  };

  const removeFromSlot = (dayIndex, mealId, recipe) => {
    setPlan((current) =>
      current.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              [mealId]: (day[mealId] ?? []).filter((r) => r.id !== recipe.id),
            }
          : day
      )
    );
    setAnnouncement(
      `${recipe.title} removed from ${week[dayIndex].long} ${mealLabel(mealId)}.`
    );
  };

  const clearPlan = () => {
    setPlan(emptyPlan());
    setChecked([]);
    setAnnouncement("Plan cleared.");
  };

  const toggleChecked = useCallback(
    (key) =>
      setChecked((current) =>
        current.includes(key)
          ? current.filter((k) => k !== key)
          : [...current, key]
      ),
    []
  );

  // Solo cuentan las comidas visibles: lo que quede en una eliminada se
  // conserva en el plan, pero no aparece en el calendario ni en la compra.
  const plannedRecipes = useMemo(() => {
    const byId = new Map();
    for (const day of plan)
      for (const meal of activeMeals)
        for (const recipe of day[meal.id] ?? []) byId.set(recipe.id, recipe);
    return [...byId.values()];
  }, [plan, activeMeals]);

  return (
    <PlannerContext.Provider
      value={{
        week,
        plan,
        slotOf,
        settings,
        updateSettings,
        shareId,
        shareInfo,
        startShare,
        joinShare,
        leaveShare,
        activeMeals,
        maxPerSlot,
        updateMeal,
        addMeal,
        removeMeal,
        moveMeal,
        addToSlot,
        removeFromSlot,
        clearPlan,
        plannedRecipes,
        checked,
        toggleChecked,
        announcement,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}
