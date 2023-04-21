import React from "react";
import { useDrag } from "react-dnd";
import { RoundedImageStyled } from "../styled";

function MealCard({ recipe }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "recipeCard",
    item: { id: recipe.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  let title =
    recipe.title.toUpperCase().slice(0, 1) +
    recipe.title
      .replace(/\s*\(.*?\)\s*/g, "")
      .toLowerCase()
      .slice(1);

  if (title.split(" ").length > 7) {
    const numberOfWordsToSlice = Math.abs(title.split(" ").length - 7);
    title = title.split(" ").slice(0, -numberOfWordsToSlice).join(" ");
  }

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
      <div className="meal-title">{title}</div>
    </div>
  );
}

export default MealCard;
