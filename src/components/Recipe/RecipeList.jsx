import React, { useContext, useState, useMemo } from "react";
import { RecipeContext } from "../../context/RecipeContext";

import RecipeCard from "./RecipeCard";

function RecipeList({ recipes }) {
  return (
    <>
      <div className="recipe-container">
        <ul>
          {recipes &&
            recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe}/>
            ))}
        </ul>
      </div>
    </>
  );
}

export default RecipeList;
