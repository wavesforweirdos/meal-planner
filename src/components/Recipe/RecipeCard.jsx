import { useDrag } from "react-dnd";
import { BackgroundCardStyled } from "../styled";

import { RecipeContext } from "../../context/RecipeContext";
import { useContext, useState, useEffect } from "react";

import { queryRecipeById, options } from "../../data/recipe";

function RecipeCard({ recipe }) {
  const { showModal } = useContext(RecipeContext);
  const url = queryRecipeById + recipe.id;
  const [actualRecipe, setActualRecipe] = useState(recipe);

  useEffect(() => {
    const getRecipeData = async () => {
      try {
        const res = await fetch(url, options);
        let actualData = await res.json();
        setActualRecipe(actualData[0]);
      } catch (err) {
        console.log(err);
      }
    };
    getRecipeData();
  }, []);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "recipeCard",
    item: { id: actualRecipe.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <>
      <BackgroundCardStyled
        ref={dragRef}
        imageUrl={actualRecipe.image}
        className="recipe-card"
        id={actualRecipe.id}
        style={{ opacity: isDragging ? "50%" : "100%" }}
        draggable
        onClick={() => showModal(actualRecipe)}
      >
        <div className="recipe recipe-title">
          <p className="title">
            {actualRecipe.title &&
              actualRecipe.title.replace(/\s*\(.*?\)\s*/g, "").toUpperCase()}
          </p>
        </div>
        <div className="recipe recipe-information">
          <div className="container">
            <div className="info time">
              <p>Ready in {actualRecipe.readyInMinutes} min</p>
            </div>
            <div className="nutrition">
              {actualRecipe.nutrition &&
                actualRecipe.nutrition.nutrients.map((nutrient) => {
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
              <div className="info-units">${actualRecipe.pricePerServing}</div>
            </div>
          </div>
        </div>
      </BackgroundCardStyled>
    </>
  );
}

export default RecipeCard;
