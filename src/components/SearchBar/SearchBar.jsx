import { useState, useContext, useEffect } from "react";
import { RecipeContext } from "../../context/RecipeContext";

function SearchBar() {
  const { data, setDataFiltered } = useContext(RecipeContext);
  const [query, setQuery] = useState("");

  const searchQuery = (e) => {
    e.preventDefault();
    setQuery(e.target.value);

    if (query !== "") {
      setDataFiltered(query);
    }
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
