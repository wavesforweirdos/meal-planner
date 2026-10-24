import { useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import { RecipeContext } from "../../context/RecipeContext";
import { caloriesOf, cleanTitle, priceOf } from "../../utils/recipe";
import IconButton from "../IconButton";
import { useFavorites, toggleFavorite } from "../../utils/useFavorites";
import {
  CalendarPlusIcon,
  ClockIcon,
  FlameIcon,
  HeartIcon,
  PeopleIcon,
  TagIcon,
} from "../Icons";

function RecipeCard({ recipe }) {
  const { openDetail, openAdd } = useContext(RecipeContext);
  const { user } = useContext(AuthContext);
  // Sin sesión, estas acciones piden entrar.
  const needLogin = () => {
    window.location.hash = "home";
  };

  const title = cleanTitle(recipe.title);
  // Primera palabra en negrita y el resto más ligero, como en la referencia.
  const [firstWord, ...restWords] = title.split(" ");
  const favourite = useFavorites().some((r) => r.id === recipe.id);
  const kcal = caloriesOf(recipe);
  const price = priceOf(recipe);
  // `summary` llega como HTML: se queda solo con el texto.
  const description = useMemo(
    () =>
      new DOMParser().parseFromString(recipe.summary ?? "", "text/html").body
        .textContent,
    [recipe.summary]
  );

  return (
    <li className="card">
      <img
        className="card__img"
        src={recipe.image}
        alt=""
        width="96"
        height="96"
        loading="lazy"
      />
      <h2 className="card__title">
        <button
          type="button"
          className="card__open"
          onClick={() => openDetail(recipe)}
        >
          <strong>{firstWord}</strong>
          {restWords.length > 0 && ` ${restWords.join(" ")}`}
        </button>
      </h2>
      <p className="card__desc">{description}</p>
      <ul className="card__facts">
        {kcal !== null && (
          <li>
            <FlameIcon /> {kcal} kcal
          </li>
        )}
        <li>
          <ClockIcon /> {recipe.readyInMinutes} min
        </li>
        <li>
          <PeopleIcon /> {recipe.servings}{" "}
          {recipe.servings === 1 ? "serving" : "servings"}
        </li>
        {price && (
          <li>
            <TagIcon /> {price} / serving
          </li>
        )}
      </ul>
      <div className="card__actions">
        <IconButton
          label={user ? `Add to plan: ${title}` : `Sign in to add ${title} to your plan`}
          variant="dark"
          className="card__add"
          onClick={() => (user ? openAdd(recipe) : needLogin())}
        >
          <CalendarPlusIcon />
        </IconButton>
        <button
          type="button"
          className="card__fav"
          aria-pressed={favourite}
          aria-label={`Favourite: ${title}`}
          title={user ? "Favourite" : "Sign in to save favourites"}
          onClick={() => (user ? toggleFavorite(recipe) : needLogin())}
        >
          <HeartIcon filled={favourite} />
        </button>
      </div>
    </li>
  );
}

export default RecipeCard;
