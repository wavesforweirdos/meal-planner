import { useContext } from "react";
import { RecipeContext } from "../../context/RecipeContext";
import { AuthContext } from "../../context/AuthContext";
import { DIETS, MEALS } from "../../utils/recipe";
import { GridIcon, HeartIcon, MealIcon } from "../Icons";

function Filters() {
  const { mealFilter, chooseMeal, dietFilters, toggleDiet, favOnly, toggleFavOnly } =
    useContext(RecipeContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="filters">
      <p className="filters__title" id="f-meal">Meal</p>
      <div role="group" aria-labelledby="f-meal" className="chips chips--meal">
        {[{ id: "all", label: "All meals" }, ...MEALS].map((meal) => (
          <button
            key={meal.id}
            type="button"
            className="chip chip--icon"
            aria-pressed={mealFilter === meal.id}
            aria-label={meal.label}
            data-tip={meal.label}
            onClick={() => chooseMeal(meal.id)}
          >
            {meal.id === "all" ? <GridIcon /> : <MealIcon id={meal.id} />}
          </button>
        ))}
      </div>
      {user && (
      <>
      <p className="filters__title" id="f-show">Saved</p>
      <div role="group" aria-labelledby="f-show" className="chips">
        <button
          type="button"
          className="chip chip--text-icon"
          aria-pressed={favOnly}
          onClick={toggleFavOnly}
        >
          <HeartIcon filled={favOnly} /> Favourites
        </button>
      </div>
      </>
      )}
      <p className="filters__title" id="f-diet">Diet</p>
      <div role="group" aria-labelledby="f-diet" className="chips">
        {DIETS.map((diet) => (
          <button
            key={diet.id}
            type="button"
            className="chip chip--diet"
            aria-pressed={dietFilters.includes(diet.id)}
            onClick={() => toggleDiet(diet.id)}
          >
            {diet.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Filters;
