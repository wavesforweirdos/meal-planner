import { useContext, useState } from "react";
import { PlannerContext } from "../../context/PlannerContext";
import { RecipeContext } from "../../context/RecipeContext";
import { cleanTitle } from "../../utils/recipe";
import PlannedRecipe from "./PlannedRecipe";
import { PlusIcon } from "../Icons";

// Un hueco del calendario (día × franja). Es un destino para soltar recetas y,
// además, un botón (invisible en escritorio) que lo elige como destino del panel.
function MealCell({ day, meal, recipes, selected, onSelect }) {
  const { findRecipe } = useContext(RecipeContext);
  const { addToSlot, removeFromSlot, maxPerSlot } = useContext(PlannerContext);
  const [over, setOver] = useState(false);

  const full = recipes.length >= maxPerSlot;
  const label = `${day.long} ${meal.label}`;
  const contents = recipes.length
    ? `. Currently: ${recipes.map((r) => cleanTitle(r.title)).join(", ")}`
    : "";

  const onDrop = (e) => {
    e.preventDefault();
    setOver(false);
    const id = Number(e.dataTransfer.getData("text/plain"));
    const from = e.dataTransfer.getData("application/x-slot");
    if (from === `${day.index}-${meal.id}`) return;
    const recipe = findRecipe(id);
    if (!recipe) return;
    const result = addToSlot(day.index, meal.id, recipe);
    // Si venía de otro hueco del calendario, se mueve en vez de copiarse.
    if (from && result === "added") {
      const [fromDay, fromMeal] = from.split("-");
      removeFromSlot(Number(fromDay), fromMeal, recipe);
    }
  };

  return (
    <div
      role="group"
      aria-label={label}
      data-slot={`${day.index}-${meal.id}`}
      className={`cell cell--${meal.color}${recipes.length ? "" : " cell--empty"}${selected ? " cell--active" : ""}${over ? " cell--over" : ""}`}
      onDragOver={(e) => {
        if (full) return;
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <p className="cell__label">{meal.label}</p>
      {recipes.length > 0 && (
        <ul className="cell__list">
          {recipes.map((recipe) => (
            <PlannedRecipe
              key={recipe.id}
              recipe={recipe}
              day={day}
              meal={meal}
            />
          ))}
        </ul>
      )}
      <button
        type="button"
        className="cell__add"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Add recipes to ${label}${contents}`}
      >
        <PlusIcon />
      </button>
    </div>
  );
}

export default MealCell;
