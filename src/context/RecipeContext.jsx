import { createContext, useState, useEffect } from "react";
import { options, querySearchRecipe, defaultRecipeBook } from "../data";

export const RecipeContext = createContext();

export function RecipeContextProvider(props) {
  const [stateModal, setStateModal] = useState({ state: false, recipe: null });
  const [data, setData] = useState(defaultRecipeBook);

  //------------------- Paginate functions -------------------//

  const [page, setPage] = useState(0);
  const recipesPerPage = 9;
  const numberOfRecipesVistited = page * recipesPerPage;
  const totalPages = data ? Math.ceil(data.length / recipesPerPage) : 0;

  const displayRecipes = data
    ? data.slice(
        numberOfRecipesVistited,
        numberOfRecipesVistited + recipesPerPage
      )
    : [];

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  //------------------- Search functions -------------------//

  async function searchRecipes(query) {
    const url = querySearchRecipe + query;
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        setData(defaultRecipeBook);
        setData(
          data.filter((recipe) => {
            if (recipe.title.toLowerCase().includes(query.toLowerCase())) {
              return recipe;
            }
          })
        );
        const message = `An error has occured: ${res.status}. ${res.statusText}`;
        throw new Error(message);
      } else {
        const data = await res.json();
        setData(data.results);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  function resetData() {
    setData(defaultRecipeBook);
  }

  //------------------- Modal functions -------------------//
  const showModal = (recipe) => {
    setStateModal({ state: true, recipe: recipe });
  };

  const hideModal = () => {
    setStateModal({ state: false, recipe: null });
  };

  //------------------- KeyDown functions -------------------//
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        hideModal();
        resetData();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <RecipeContext.Provider
      value={{
        data,
        totalPages,
        displayRecipes,
        changePage,
        searchRecipes,
        resetData,
        stateModal,
        showModal,
        hideModal,
      }}
    >
      {props.children}
    </RecipeContext.Provider>
  );
}
