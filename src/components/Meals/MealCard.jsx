import React from "react";
import { useDrag } from "react-dnd";
import { RoundedImageStyled } from "../styled";

function MealCard({ recipe }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "recipeCard",
    // item: { id: recipe.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <div
      className="meal-card row-center"
      ref={dragRef}
      id={recipe.id}
      style={{ opacity: isDragging ? "50%" : "100%" }}
      draggable
    >
      <div className="meal-image">
        <RoundedImageStyled imageUrl={recipe.image} />
      </div>
      <div className="meal-title">
        {recipe.title.toUpperCase().slice(0, 1) +
          recipe.title
            .replace(/\s*\(.*?\)\s*/g, "")
            .toLowerCase()
            .slice(1)}
      </div>
    </div>
  );
}

export default MealCard;
