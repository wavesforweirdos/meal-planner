import React from "react";
import { BackgroundCardStyled } from "../styled";

function IngredientCard({ ingredient }) {
  const name =
    ingredient.name.slice(0, 1).toUpperCase() + ingredient.name.slice(1);

  let originalName = false;
  if (ingredient.name != ingredient.originalName) {
    originalName =
      ingredient.originalName.slice(0, 1).toUpperCase() +
      ingredient.originalName.slice(1);
  }
  const units = ingredient.amount + " " + ingredient.measures.us.unitLong;

  const grams =
    ingredient.measures.metric.amount +
    " " +
    ingredient.measures.metric.unitLong;
  return (
    <div className="ingredient">
      <BackgroundCardStyled
        className="food_image_column"
        imageUrl={
          "https://spoonacular.com/cdn/ingredients_250x250/" + ingredient.image
        }
      />
      <div className="food_name_column">
        <div className="print_name">{name}</div>
        {originalName && <div className="food_description">{originalName}</div>}
      </div>
      <div className="food_amount_column">
        <div className="food_units">{units}</div>
        <div className="gram_printout">{grams}</div>
      </div>
    </div>
  );
}

export default IngredientCard;
