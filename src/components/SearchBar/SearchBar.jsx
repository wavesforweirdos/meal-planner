import { useState, useContext, useEffect } from "react";
import { RecipeContext } from "../../context/RecipeContext";

function SearchBar() {
  const { searchRecipes, resetData } = useContext(RecipeContext);
  const [query, setQuery] = useState("");

  const searchQuery = (e) => {
    e.preventDefault();
    setQuery(e.target.value);

    if (query !== "") {
      searchRecipes(query);
    }

    const keyDownHandler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        resetData();
        return (e.target.value = "");
      }
      document.removeEventListener("keydown", keyDownHandler);
    };
    document.addEventListener("keydown", keyDownHandler);
  };

  return (
    <div className="search-form-container">
      <form className="search-form">
        <input
          id="search"
          type="search"
          className="search-input"
          placeholder="search..."
          onChange={(e) => {
            searchQuery(e);
          }}
        />
      </form>
    </div>
  );
}

export default SearchBar;
