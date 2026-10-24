import { useContext } from "react";
import { RecipeContext } from "../../context/RecipeContext";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import RecipeCard from "./RecipeCard";

function RecipesPanel() {
  const { displayRecipes, resultCount, favOnly } = useContext(RecipeContext);

  return (
    <section className="view recipes" aria-labelledby="view-title">
      <div className="section-head">
        <div>
          <h1 id="view-title" tabIndex="-1" className="section-title">
            Discover
          </h1>
        </div>
      </div>

      <div className="recipes__layout">
        <div className="recipes__tools">
          <SearchBar />
          <Filters />
        </div>

        <div className="recipes__results">
          <p className="results-count" role="status">
            {resultCount === 0
              ? favOnly
                ? "No favourites yet: tap the heart on a recipe."
                : "No recipes match your search."
              : `${resultCount} ${resultCount === 1 ? "recipe" : "recipes"}`}
          </p>
          <div className="recipes__area">
            <ul className="recipe-grid">
              {displayRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecipesPanel;
