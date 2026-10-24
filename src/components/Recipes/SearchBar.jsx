import { useContext, useEffect, useRef, useState } from "react";
import { RecipeContext } from "../../context/RecipeContext";
import IconButton from "../IconButton";
import InfoPopover from "../InfoPopover";
import { CheckIcon, SearchIcon, TrashIcon } from "../Icons";

export function SearchField({ id = "search" }) {
  const { searchRecipes, resetData } = useContext(RecipeContext);
  const [query, setQuery] = useState("");
  const first = useRef(true);

  // Espera a que termine de escribir antes de buscar, para no gastar cuota de la API.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const value = query.trim();
    const timer = setTimeout(
      () => (value ? searchRecipes(value) : resetData()),
      400
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && query) {
      e.preventDefault();
      e.stopPropagation();
      setQuery("");
    }
  };

  return (
    <form
      className="search__form"
      role="search"
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor={id} className="visually-hidden">
        Search recipes
      </label>
      <input
        id={id}
        type="search"
        className="search__input"
        placeholder="Search recipes…"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <span className="search__icon">
        <SearchIcon />
      </span>
    </form>
  );
}

function SearchBar() {
  const { apiKey, updateApiKey, searchNotice } = useContext(RecipeContext);
  const [keyDraft, setKeyDraft] = useState(apiKey);

  const handleKeySubmit = (e) => {
    e.preventDefault();
    updateApiKey(keyDraft);
  };

  return (
    <div className="search">
      <div className="search__row">
        <SearchField />
        <InfoPopover label="About these recipes">
          <p>
            Recipes come from the{" "}
            <a href="https://spoonacular.com/food-api">Spoonacular API</a>.{" "}
            {apiKey
              ? "You are using your own API key."
              : "You are seeing a set of sample recipes; paste your own API key to search the whole catalogue."}
          </p>
          <form className="api-key__form" onSubmit={handleKeySubmit}>
            <label htmlFor="api-key">Spoonacular API key</label>
            <div className="api-key__row">
              <input
                id="api-key"
                type="password"
                autoComplete="off"
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
              />
              <IconButton
                type="submit"
                variant="dark"
                label={keyDraft.trim() ? "Save API key" : "Remove API key"}
              >
                {keyDraft.trim() ? <CheckIcon /> : <TrashIcon />}
              </IconButton>
            </div>
            <p className="api-key__hint">
              It is only stored in this browser and sent to Spoonacular. Get a
              free one at{" "}
              <a href="https://spoonacular.com/food-api">
                spoonacular.com/food-api
              </a>
              .
            </p>
          </form>
        </InfoPopover>
      </div>

      {searchNotice && (
        <p className="notice" role="status">
          {searchNotice}
        </p>
      )}
    </div>
  );
}

export default SearchBar;
