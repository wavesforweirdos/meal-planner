import React, { useContext } from "react";
import { RecipeContext } from "../../context/RecipeContext";

import { BasketIcon, CloseIcon, CupHotIcon } from "../../assets/svg/icons";
import IngredientsList from "../Ingredient/IngredientsList";
import StepsList from "../Steps/StepsList";

import { BackgroundCardStyled } from "../styled";

function RecipeModal() {
  const { stateModal, showModal, hideModal } = useContext(RecipeContext);
  const showHideclassName = stateModal.state ? "block" : "none";

  const recipe = stateModal.recipe;

  if (recipe) {
    return (
      <>
        <div className="modal" style={{ display: showHideclassName }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">{recipe.title}</h2>
                <button
                  type="button"
                  className="close"
                  onClick={() => hideModal(recipe)}
                >
                  <CloseIcon />
                </button>
              </div>
              <BackgroundCardStyled
                className="modal-basic-info food-image"
                imageUrl={"'" + recipe.image + "'"}
              >
                {/* <div className="food-image">
                  <img src={recipe.image} />
                </div> */}
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
                  <IngredientsList ingredients={recipe.extendedIngredients} />
                  <StepsList steps={recipe.analyzedInstructions[0].steps} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal-backdrop"
          style={{ display: showHideclassName }}
          onClick={() => hideModal(recipe)}
        ></div>
      </>
    );
  }
}
export default RecipeModal;
