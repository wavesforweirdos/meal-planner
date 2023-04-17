import { useState, useContext, useEffect } from "react";
import { useDrop } from "react-dnd";
import { RecipeContext } from "../../context/RecipeContext";
import MealCard from "./MealCard";
import { EventStyled } from "../styled";

function MealContainer(props) {
  const { data } = useContext(RecipeContext);

  const [box, setBox] = useState([]);
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "recipeCard",
    drop: (item) => addRecipeToCard(item),
    drag: (item) => deleteRecipeFromCard(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const realData = data;

  const addRecipeToCard = (item) => {
    const recipeList = realData.filter((recipe) => item.id === recipe.id);
    setBox((box) => [...box, recipeList[0]]);
  };

  const classPlaceholder = "event column-center " + props.type;
  const classMeal = "event column-center";
  return (
    <EventStyled
      ref={dropRef}
      className={box.length == 0 ? classPlaceholder : classMeal}
      span={
        box.length != 0
          ? box.length + 1
          : props.type != "dinner"
          ? "2"
          : box.length + 4
      }
    >
      {box.length == 0 && (
        <div className="meal-placeholder">{props.placeholder}</div>
      )}
      {box.map((recipe, index) => {
        if (box.length > 3) {
          setBox(box.slice(1, 4));
        }
        return <MealCard key={index} recipe={recipe} className="card" />;
      })}
    </EventStyled>
  );
}

export default MealContainer;
