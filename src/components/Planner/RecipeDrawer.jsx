import { useContext, useEffect, useState } from "react";
import { PlannerContext } from "../../context/PlannerContext";
import { RecipeContext } from "../../context/RecipeContext";
import { caloriesOf, cleanTitle, matchesMeal } from "../../utils/recipe";
import { SearchField } from "../Recipes/SearchBar";
import IconButton from "../IconButton";
import { CheckIcon, CloseIcon, MealGlyph, PlusIcon, GridIcon } from "../Icons";

// Panel de recetas del plan: siempre visible en escritorio y tablet, y hoja
// inferior en móvil. Cada receta se puede arrastrar hasta cualquier hueco del
// calendario o añadir con su botón al hueco elegido (la receta ya añadida se
// quita con el mismo botón).
function RecipeDrawer({ target, onClose }) {
  const { searchResults, openDetail } = useContext(RecipeContext);
  const {
    week,
    slotOf,
    activeMeals,
    maxPerSlot,
    addToSlot,
    removeFromSlot,
  } = useContext(PlannerContext);
  const [mealFilter, setMealFilter] = useState(target.mealId);

  // El filtro sigue a la franja elegida (pero se puede ampliar a "All").
  useEffect(() => setMealFilter(target.mealId), [target.mealId]);

  const day = week[target.dayIndex];
  const meal = activeMeals.find((m) => m.id === target.mealId);
  const inSlot = slotOf(target.dayIndex, target.mealId);
  const full = inSlot.length >= maxPerSlot;
  const where = `${day.long} ${meal.label}`;
  // Las comidas personalizadas ("other") no filtran: muestran todas las recetas.
  const filterMeal = activeMeals.find((m) => m.id === mealFilter);
  const recipes =
    !filterMeal || filterMeal.type === "other"
      ? searchResults
      : searchResults.filter((r) => matchesMeal(r, filterMeal.type));

  return (
    <aside
      className="drawer"
      aria-labelledby="drawer-title"
      onKeyDown={(e) => e.key === "Escape" && onClose?.()}
    >
      <h2 id="drawer-title" tabIndex="-1" className="visually-hidden">
        Recipes for {where}
      </h2>
      <p className="visually-hidden" role="status">
        {where}: {inSlot.length} of {maxPerSlot} recipes{full ? ", full" : ""}.
      </p>

      {onClose && (
        <IconButton
          label="Close recipe list"
          className="drawer__close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      )}

      <SearchField id="drawer-search" />

      <div role="group" aria-label="Meal type" className="chips chips--small">
        {[{ id: "all", label: "All meals" }, ...activeMeals].map((m) => (
          <button
            key={m.id}
            type="button"
            className="chip chip--icon"
            aria-pressed={mealFilter === m.id}
            aria-label={m.label}
            title={m.label}
            onClick={() => setMealFilter(m.id)}
          >
            {m.id === "all" ? <GridIcon /> : <MealGlyph meal={m} />}
          </button>
        ))}
      </div>

      <ul className="drawer__list">
        {recipes.length === 0 && (
          <li className="drawer__empty">No recipes match.</li>
        )}
        {recipes.map((recipe) => {
          const title = cleanTitle(recipe.title);
          const added = inSlot.some((r) => r.id === recipe.id);
          const kcal = caloriesOf(recipe);
          return (
            <li
              key={recipe.id}
              className="pick"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", String(recipe.id));
                e.dataTransfer.effectAllowed = "copy";
              }}
            >
              <img
                className="pick__img"
                src={recipe.image}
                alt=""
                width="48"
                height="48"
                loading="lazy"
                draggable="false"
              />
              <div className="pick__text">
                <button
                  type="button"
                  className="pick__title"
                  onClick={() => openDetail(recipe)}
                >
                  {title}
                </button>
                <p className="pick__meta">
                  {kcal !== null && `${kcal} kcal · `}
                  {recipe.readyInMinutes} min
                </p>
              </div>
              {added ? (
                <IconButton
                  label={`Remove ${title} from ${where}`}
                  variant="on"
                  onClick={() =>
                    removeFromSlot(target.dayIndex, target.mealId, recipe)
                  }
                >
                  <CheckIcon />
                </IconButton>
              ) : (
                <IconButton
                  label={`Add ${title} to ${where}`}
                  variant="dark"
                  disabled={full}
                  onClick={() =>
                    addToSlot(target.dayIndex, target.mealId, recipe)
                  }
                >
                  <PlusIcon />
                </IconButton>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default RecipeDrawer;
