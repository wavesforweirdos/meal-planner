import { useContext } from "react";
import { RecipeContext } from "../../context/RecipeContext";
import {
  caloriesOf,
  cleanTitle,
  mealOf,
  priceOf,
  stepsOf,
} from "../../utils/recipe";
import IconButton from "../IconButton";
import { CalendarPlusIcon, ClockIcon, FlameIcon, PeopleIcon, TagIcon } from "../Icons";
import Dialog from "./Dialog";

function RecipeDialog() {
  const { detailRecipe: recipe, closeDetail, openAdd } =
    useContext(RecipeContext);
  if (!recipe) return null;

  const title = cleanTitle(recipe.title);
  const kcal = caloriesOf(recipe);
  const price = priceOf(recipe);
  const steps = stepsOf(recipe);

  const addToPlan = () => {
    closeDetail();
    openAdd(recipe);
  };

  return (
    <Dialog
      titleId="recipe-dialog-title"
      onClose={closeDetail}
      className={`dialog--${mealOf(recipe)}`}
    >
      <header className="recipe-detail__head">
        <img
          className="recipe-detail__img"
          src={recipe.image}
          alt=""
          width="160"
          height="160"
        />
        <div>
          <h2 id="recipe-dialog-title" className="recipe-detail__title">
            {title}
          </h2>
          <ul className="card__facts card__facts--row">
            {kcal !== null && (
              <li>
                <FlameIcon /> {kcal} kcal
              </li>
            )}
            <li>
              <ClockIcon /> {recipe.readyInMinutes} min
            </li>
            <li>
              <PeopleIcon /> {recipe.servings} {recipe.servings === 1 ? "serving" : "servings"}
            </li>
            {price && (
              <li>
                <TagIcon /> {price} / serving
              </li>
            )}
          </ul>
          <IconButton label="Add to plan" variant="dark" onClick={addToPlan}>
            <CalendarPlusIcon />
          </IconButton>
        </div>
      </header>

      <div className="recipe-detail__cols">
        <section aria-labelledby="ingredients-title">
          <h3 id="ingredients-title" className="recipe-detail__heading">
            Ingredients
          </h3>
          <ul className="ingredients">
            {(recipe.extendedIngredients ?? []).map((ing, i) => (
              <li key={`${ing.id}-${i}`}>
                <span className="ingredients__amount">
                  {ing.measures?.us?.amount
                    ? `${Math.round(ing.measures.us.amount * 100) / 100} ${ing.measures.us.unitShort}`
                    : ""}
                </span>
                <span>{ing.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="steps-title">
          <h3 id="steps-title" className="recipe-detail__heading">
            Steps
          </h3>
          {steps.length > 0 ? (
            <ol className="steps">
              {steps.map((step) => (
                <li key={step.number}>{step.step}</li>
              ))}
            </ol>
          ) : (
            <p>No step-by-step instructions available for this recipe.</p>
          )}
          {recipe.sourceUrl && (
            <p className="recipe-detail__source">
              <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
                Original recipe
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </p>
          )}
        </section>
      </div>
    </Dialog>
  );
}

export default RecipeDialog;
