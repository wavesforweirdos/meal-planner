import RecipeList from "./RecipeList";
import SearchBar from "../SearchBar/SearchBar";
import RecipeModal from "./RecipeModal";
import ReactPaginate from "react-paginate";

import { RecipeContext } from "../../context/RecipeContext";
import { useContext } from "react";

function Recipe() {
  const { displayRecipes, totalPages, changePage } =
    useContext(RecipeContext);

  return (
    <div id="recipes" className="recipes column-center">
      <SearchBar />
      <RecipeList recipes={displayRecipes} />
      <ReactPaginate
        previousLabel={"prev"}
        nextLabel={"next"}
        pageCount={totalPages}
        onPageChange={changePage}
        containerClassName={"navigationButtons"}
        previousLinkClassName={"previousButton"}
        nextLinkClassName={"nextButton"}
        disabledClassName={"navigationDisabled"}
        activeClassName={"navigationActive"}
      />
      <div className="recipe-modal">
        <RecipeModal />
      </div>
    </div>
  );
}

export default Recipe;
