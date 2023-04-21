import { useContext } from "react";
import { useDrag } from "react-dnd";

import { RecipeContext } from "../../context/RecipeContext";
import { BackgroundCardStyled } from "../styled";

function RecipeCard({ recipe }) {
  const { showModal } = useContext(RecipeContext);
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "recipeCard",
    item: { id: recipe.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <>
      <BackgroundCardStyled
        ref={dragRef}
        imageUrl={recipe.image}
        className="recipe-card"
        id={recipe.id}
        style={{ opacity: isDragging ? "50%" : "100%" }}
        draggable
        onClick={() => {
          showModal(recipe);
        }}
      >
        <div className="recipe recipe-title">
          <p className="title">
            {recipe.title &&
              recipe.title.replace(/\s*\(.*?\)\s*/g, "").toUpperCase()}
          </p>
        </div>
        <div className="recipe recipe-information">
          <div className="container">
            <div className="info time">
              <p>Ready in {recipe.readyInMinutes} min</p>
            </div>
            <div className="nutrition">
              {recipe.nutrition &&
                recipe.nutrition.nutrients.map((nutrient) => {
                  if (
                    nutrient.name == "Calories" ||
                    nutrient.name == "Carbohydrates" ||
                    nutrient.name == "Sugar" ||
                    nutrient.name == "Fat" ||
                    nutrient.name == "Protein"
                  ) {
                    const className =
                      "nutrients " + nutrient.name.toLowerCase();
                    let name = nutrient.name;
                    switch (name) {
                      case "Carbohydrates":
                        name = nutrient.name.slice(0, 4) + ".";
                        break;
                      case "Protein":
                        name = nutrient.name.slice(0, 4) + ".";
                        break;
                      case "Fat":
                        name = nutrient.name.slice(0, 3);
                        break;
                      default:
                        name = nutrient.name.slice(0, 3) + ".";
                        break;
                    }

                    return (
                      <div className={className} key={nutrient.name}>
                        <div className="info-name">{name}</div>
                        <div className="info-units">
                          {nutrient.amount} {nutrient.unit}
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
            <div className="price info">
              <div className="info-name">Price</div>
              <div className="info-units">${recipe.pricePerServing}</div>
            </div>
          </div>
        </div>
      </BackgroundCardStyled>
    </>
  );
}

export default RecipeCard;
