import { createContext, useState, useEffect } from "react";
import { queryRandomRecipes, options } from "../data/recipe";

export const RecipeContext = createContext();

export function RecipeContextProvider(props) {
  const [data, setData] = useState([]);
  const [stateModal, setStateModal] = useState({ state: false, recipe: null });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(queryRandomRecipes, options);
        let actualData = await res.json();
        setData(actualData.recipes);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  function setDataFiltered(query) {
    setData(
      data.filter((recipe) => {
        if (recipe.title.toLowerCase().includes(query.toLowerCase())) {
          return recipe;
        }
      })
    );
  }

  const showModal = (recipe) => {
    setStateModal({ state: true, recipe: recipe });
  };

  const hideModal = (recipe) => {
    setStateModal({ state: false, recipe: null });
  };

  return (
    <RecipeContext.Provider
      value={{
        data,
        setDataFiltered,
        stateModal,
        showModal,
        hideModal,
      }}
    >
      {props.children}
    </RecipeContext.Provider>
  );
}
