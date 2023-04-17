import RecipeList from "./RecipeList";
import SearchBar from "../SearchBar/SearchBar";
import RecipeModal from "./RecipeModal";
import ReactPaginate from "react-paginate";

import { RecipeContext } from "../../context/RecipeContext";
import { useContext, useState } from "react";

function Recipe() {
  const { data } = useContext(RecipeContext);

  const [page, setPage] = useState(0);
  const recipesPerPage = 6;
  const numberOfRecipesVistited = page * recipesPerPage;

  const totalPages = Math.ceil(data.length / recipesPerPage);
  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const displayRecipes = data.slice(
    numberOfRecipesVistited,
    numberOfRecipesVistited + recipesPerPage
  );

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
