import { useContext } from "react";
import { PlannerContext } from "../../context/PlannerContext";
import { RecipeContext } from "../../context/RecipeContext";
import { cleanTitle } from "../../utils/recipe";
import { CloseIcon } from "../Icons";

// Receta dentro de un hueco: plato y nombre, para ver de un vistazo qué toca.
// El aspa para quitarla aparece al pasar o enfocar (en táctil se quita desde
// el panel de recetas).
function PlannedRecipe({ recipe, day, meal }) {
  const { removeFromSlot } = useContext(PlannerContext);
  const { openDetail } = useContext(RecipeContext);
  const title = cleanTitle(recipe.title);

  return (
    <li
      className="planned"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", String(recipe.id));
        e.dataTransfer.setData("application/x-slot", `${day.index}-${meal.id}`);
        e.dataTransfer.effectAllowed = "copyMove";
      }}
    >
      <button
        type="button"
        className="planned__open"
        onClick={() => openDetail(recipe)}
        aria-label={`${title}, view recipe`}
        title={title}
      >
        <img
          src={recipe.image}
          alt=""
          width="44"
          height="44"
          loading="lazy"
          draggable="false"
        />
        <span className="planned__title">{title}</span>
      </button>
      <button
        type="button"
        className="planned__remove"
        onClick={() => removeFromSlot(day.index, meal.id, recipe)}
        aria-label={`Remove ${title} from ${day.long} ${meal.label}`}
        title="Remove"
      >
        <CloseIcon />
      </button>
    </li>
  );
}

export default PlannedRecipe;
