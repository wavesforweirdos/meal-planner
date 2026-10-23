import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { MAX_MEALS, PlannerContext } from "../../context/PlannerContext";
import IconButton from "../IconButton";
import {
  AutoIcon,
  CheckIcon,
  ChevronIcon,
  LogoutIcon,
  MealGlyph,
  MoonIcon,
  PlusIcon,
  SunIcon,
  TrashIcon,
} from "../Icons";
import Avatar from "../Avatar";
import Dialog from "./Dialog";

// Emojis que se ofrecen para cada comida (además de poder escribir otro).
const EMOJIS = [
  "☕", "🥐", "🍳", "🥞", "🥗", "🍝", "🍕", "🍔", "🌮", "🍣", "🍲", "🍜",
  "🍎", "🍌", "🍪", "🍰", "🍫", "🥤", "🍷", "🌙", "☀️", "🍽️", "🥑", "🧀",
];

// Ajustes del plan: comidas de cada día (nombre, emoji y orden), cuántas
// recetas admite cada una y apariencia.
function SettingsDialog({ onClose }) {
  const {
    settings,
    updateSettings,
    updateMeal,
    addMeal,
    removeMeal,
    moveMeal,
  } = useContext(PlannerContext);
  const { user, signOut } = useContext(AuthContext);
  const { meals } = settings;
  const [pickerFor, setPickerFor] = useState(null);

  return (
    <Dialog titleId="settings-title" onClose={onClose} className="dialog--small">
      <h2 id="settings-title" className="recipe-detail__title">
        Settings
      </h2>

      {user && (
        <div className="settings__group settings__account">
          <p>
            <Avatar user={user} size="1.75rem" />{" "}
            Signed in as <strong>{user.name}</strong>
          </p>
          <IconButton label="Sign out" onClick={signOut}>
            <LogoutIcon />
          </IconButton>
        </div>
      )}

      <fieldset className="settings__group">
        <legend>Meals each day</legend>
        <p className="settings__hint">
          Rename them, pick an emoji and order them from morning to night.
        </p>
        <ul className="meals-edit">
          {meals.map((meal, i) => {
            const open = pickerFor === meal.id;
            const name = meal.label || "meal";
            return (
              <li key={meal.id}>
                <div className="meals-edit__row">
                  <button
                    type="button"
                    className="meals-edit__emojibtn"
                    aria-label={`Choose the emoji for ${name}`}
                    aria-expanded={open}
                    onClick={() => setPickerFor(open ? null : meal.id)}
                  >
                    <MealGlyph meal={meal} />
                  </button>
                  <input
                    className="meals-edit__name"
                    aria-label={`Name of meal ${i + 1}`}
                    value={meal.label}
                    maxLength={24}
                    onChange={(e) => updateMeal(meal.id, { label: e.target.value })}
                    onBlur={(e) =>
                      !e.target.value.trim() &&
                      updateMeal(meal.id, { label: "Meal" })
                    }
                  />
                  <IconButton
                    label={`Move ${name} up`}
                    className="icon-btn--small"
                    disabled={i === 0}
                    onClick={() => moveMeal(meal.id, -1)}
                  >
                    <ChevronIcon dir="up" />
                  </IconButton>
                  <IconButton
                    label={`Move ${name} down`}
                    className="icon-btn--small"
                    disabled={i === meals.length - 1}
                    onClick={() => moveMeal(meal.id, 1)}
                  >
                    <ChevronIcon dir="down" />
                  </IconButton>
                  <IconButton
                    label={`Remove ${name}`}
                    className="icon-btn--small"
                    disabled={meals.length === 1}
                    onClick={() => removeMeal(meal.id)}
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
                {open && (
                  <div
                    className="emoji-grid"
                    role="group"
                    aria-label={`Emojis for ${name}`}
                  >
                    <button
                      type="button"
                      title="Default icon"
                      aria-label="Use the default icon"
                      aria-pressed={!meal.emoji}
                      onClick={() => updateMeal(meal.id, { emoji: "" })}
                    >
                      <MealGlyph meal={{ ...meal, emoji: "" }} />
                    </button>
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        aria-pressed={meal.emoji === emoji}
                        onClick={() => updateMeal(meal.id, { emoji })}
                      >
                        {emoji}
                      </button>
                    ))}
                    <input
                      className="emoji-grid__custom"
                      aria-label="Or type any emoji"
                      maxLength={8}
                      value={EMOJIS.includes(meal.emoji) ? "" : meal.emoji}
                      placeholder="+"
                      onChange={(e) =>
                        updateMeal(meal.id, { emoji: e.target.value })
                      }
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <IconButton
          label="Add a meal"
          variant="dark"
          disabled={meals.length >= MAX_MEALS}
          onClick={addMeal}
        >
          <PlusIcon />
        </IconButton>
      </fieldset>

      <div className="settings__group">
        <label htmlFor="per-slot" className="settings__label">
          Recipes per meal
        </label>
        <select
          id="per-slot"
          value={settings.perSlot}
          onChange={(e) => updateSettings({ perSlot: Number(e.target.value) })}
        >
          {[1, 2, 3].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="settings__group">
        <legend>Appearance</legend>
        <div className="chips settings__theme">
          {[
            { id: "system", label: "System", icon: <AutoIcon /> },
            { id: "light", label: "Light", icon: <SunIcon /> },
            { id: "dark", label: "Dark", icon: <MoonIcon /> },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className="chip chip--text-icon"
              aria-pressed={settings.theme === t.id}
              onClick={() => updateSettings({ theme: t.id })}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="add-form__actions">
        <IconButton label="Done" variant="dark" onClick={onClose}>
          <CheckIcon />
        </IconButton>
      </div>
    </Dialog>
  );
}

export default SettingsDialog;
