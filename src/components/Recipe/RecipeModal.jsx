import React, { useContext } from "react";
import { RecipeContext } from "../../context/RecipeContext";

import { BasketIcon, CloseIcon, CupHotIcon } from "../../assets/svg/icons";
import IngredientsList from "../Ingredient/IngredientsList";
import StepsList from "../Steps/StepsList";

import { BackgroundCardStyled } from "../styled";

function RecipeModal() {
  const { stateModal, hideModal } = useContext(RecipeContext);
  const modalClassName = stateModal.state ? "block" : "none";

  const recipe = stateModal.recipe;
  if (recipe) {
    const analyzedInstructions = recipe.analyzedInstructions;
    const steps =
      analyzedInstructions.length != 0 ? analyzedInstructions[0].steps : [];

    const title =
      recipe.title.toUpperCase().slice(0, 1) +
      recipe.title
        .replace(/\s*\(.*?\)\s*/g, "")
        .toLowerCase()
        .slice(1);
    return (
      <>
        <div className="modal" style={{ display: modalClassName }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {recipe.title && title}
                </h2>
                <button
                  type="button"
                  className="close"
                  onClick={() => hideModal()}
                >
                  <CloseIcon />
                </button>
              </div>
              <BackgroundCardStyled
                className="modal-basic-info food-image"
                imageUrl={"'" + recipe.image + "'"}
              >
                <div className="food-time">
                  <div className="time-info">
                    <BasketIcon />
                    {recipe.preparationMinutes} min to prepare
                  </div>
                  <div className="time-info">
                    <CupHotIcon />
                    {recipe.cookingMinutes} min to cook
                  </div>
                </div>
              </BackgroundCardStyled>
              <div className="modal-body" id="food_object_modal_body">
                <div className="info_container">
                  {recipe.extendedIngredients && (
                    <IngredientsList ingredients={recipe.extendedIngredients} />
                  )}
                  {analyzedInstructions.length != 0 && steps && (
                    <StepsList steps={steps} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal-backdrop"
          style={{ display: modalClassName }}
          onClick={() => hideModal()}
        ></div>
      </>
    );
  }
}
export default RecipeModal;
