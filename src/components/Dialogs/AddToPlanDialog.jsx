import { useContext, useState } from "react";
import { RecipeContext } from "../../context/RecipeContext";
import { PlannerContext } from "../../context/PlannerContext";
import { cleanTitle, mealOf } from "../../utils/recipe";
import IconButton from "../IconButton";
import { CheckIcon, CloseIcon } from "../Icons";
import Dialog from "./Dialog";

function AddToPlanDialog() {
  const { recipeToAdd } = useContext(RecipeContext);
  // `key` reinicia los valores por defecto al abrirlo para otra receta.
  return recipeToAdd ? (
    <AddForm key={recipeToAdd.id} recipe={recipeToAdd} />
  ) : null;
}

function AddForm({ recipe }) {
  const { closeAdd } = useContext(RecipeContext);
  const { week, addToSlot, activeMeals, maxPerSlot } = useContext(PlannerContext);
  const [dayIndex, setDayIndex] = useState(
    Math.max(0, week.findIndex((d) => d.isToday))
  );
  const [mealId, setMealId] = useState(() => {
    const suggested = mealOf(recipe);
    return (activeMeals.find((m) => m.type === suggested) ?? activeMeals[0]).id;
  });
  const [error, setError] = useState("");

  const title = cleanTitle(recipe.title);

  const submit = (e) => {
    e.preventDefault();
    const result = addToSlot(dayIndex, mealId, recipe);
    if (result === "added") return closeAdd();
    setError(
      result === "full"
        ? `That slot is full (${maxPerSlot} recipes maximum). Choose another.`
        : "That recipe is already in that slot. Choose another."
    );
  };

  return (
    <Dialog
      titleId="add-dialog-title"
      onClose={closeAdd}
      className="dialog--small"
    >
      <h2 id="add-dialog-title" className="recipe-detail__title">
        Add to plan
      </h2>
      <p className="add-form__recipe">{title}</p>
      <form className="add-form" onSubmit={submit}>
        <label htmlFor="add-day">Day</label>
        <select
          id="add-day"
          value={dayIndex}
          onChange={(e) => {
            setDayIndex(Number(e.target.value));
            setError("");
          }}
        >
          {week.map((day) => (
            <option key={day.index} value={day.index}>
              {day.long} {day.num}
              {day.isToday ? " (today)" : ""}
            </option>
          ))}
        </select>

        <label htmlFor="add-meal">Meal</label>
        <select
          id="add-meal"
          value={mealId}
          onChange={(e) => {
            setMealId(e.target.value);
            setError("");
          }}
        >
          {activeMeals.map((meal) => (
            <option key={meal.id} value={meal.id}>
              {meal.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}

        <div className="add-form__actions">
          <IconButton label="Cancel" onClick={closeAdd}>
            <CloseIcon />
          </IconButton>
          <IconButton label="Add to plan" variant="dark" type="submit">
            <CheckIcon />
          </IconButton>
        </div>
      </form>
    </Dialog>
  );
}

export default AddToPlanDialog;
