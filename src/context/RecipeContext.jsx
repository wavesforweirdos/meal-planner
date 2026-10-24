import { createContext, useMemo, useState } from "react";
import { options, buildSearchUrl, defaultRecipeBook } from "../data";
import { loadApiKey, saveApiKey } from "../utils/apiKey";
import { DIETS, matchesMeal } from "../utils/recipe";
import { useFavorites } from "../utils/useFavorites";

export const RecipeContext = createContext();

export function RecipeContextProvider({ children }) {
  const [data, setData] = useState(defaultRecipeBook);
  const [detailRecipe, setDetailRecipe] = useState(null);
  const [recipeToAdd, setRecipeToAdd] = useState(null);

  //------------------- Filters -------------------//

  const [mealFilter, setMealFilter] = useState("all");
  const [dietFilters, setDietFilters] = useState([]);
  const [favOnly, setFavOnly] = useState(false);
  const favourites = useFavorites();

  const chooseMeal = (id) => {
    setMealFilter(id);
  };

  const toggleDiet = (id) => {
    setDietFilters((current) =>
      current.includes(id) ? current.filter((d) => d !== id) : [...current, id]
    );
  };

  const filtered = useMemo(
    () =>
      (favOnly ? favourites : data).filter(
        (recipe) =>
          (mealFilter === "all" || matchesMeal(recipe, mealFilter)) &&
          dietFilters.every((id) => DIETS.find((d) => d.id === id)?.test(recipe))
      ),
    [data, favOnly, favourites, mealFilter, dietFilters]
  );

  const displayRecipes = filtered;

  //------------------- Search -------------------//

  const [apiKey, setApiKey] = useState(loadApiKey);
  const [searchNotice, setSearchNotice] = useState("");

  const updateApiKey = (key) => {
    const clean = key.trim();
    setApiKey(clean);
    saveApiKey(clean);
    setSearchNotice("");
    setData(defaultRecipeBook);
  };

  const searchLocal = (query) =>
    defaultRecipeBook.filter((recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase())
    );

  // Sin clave busca en las recetas de ejemplo; con clave consulta Spoonacular
  // y, si falla (clave no válida o cuota agotada), vuelve a las de ejemplo.
  async function searchRecipes(query) {
    if (!apiKey) {
      setSearchNotice("");
      setData(searchLocal(query));
      return;
    }
    try {
      const res = await fetch(buildSearchUrl(apiKey, query), options);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`.trim());
      const json = await res.json();
      setSearchNotice("");
      setData(json.results);
    } catch (err) {
      setSearchNotice(
        `Spoonacular did not respond (${err.message}). Showing the sample recipes instead.`
      );
      setData(searchLocal(query));
    }
  }

  // Busca una receta por id entre los resultados actuales y las de ejemplo (arrastrar y soltar).
  const findRecipe = (id) =>
    data.find((r) => r.id === id) ?? defaultRecipeBook.find((r) => r.id === id);

  function resetData() {
    setSearchNotice("");
    setData(defaultRecipeBook);
  }

  return (
    <RecipeContext.Provider
      value={{
        displayRecipes,
        searchResults: data,
        findRecipe,
        resultCount: filtered.length,
        mealFilter,
        chooseMeal,
        favOnly,
        toggleFavOnly: () => setFavOnly((v) => !v),
        dietFilters,
        toggleDiet,
        searchRecipes,
        resetData,
        apiKey,
        updateApiKey,
        searchNotice,
        detailRecipe,
        openDetail: setDetailRecipe,
        closeDetail: () => setDetailRecipe(null),
        recipeToAdd,
        openAdd: setRecipeToAdd,
        closeAdd: () => setRecipeToAdd(null),
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}
