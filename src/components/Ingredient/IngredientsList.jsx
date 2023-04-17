import React from "react";
import IngredientCard from "./IngredientCard";

function IngredientsList({ ingredients }) {
  return (
    <div className="ingredients_list">
        {ingredients &&
          ingredients.map((ingredient, index) => (
            <IngredientCard key={index} ingredient={ingredient} />
          ))}
    </div>
  );
}

export default IngredientsList;
