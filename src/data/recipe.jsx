const urlRandomRecipes =
  "https://api.spoonacular.com/recipes/random?limitLicense=true&includeNutrition=true&number=36&";
const urlRecipeById =
  "https://api.spoonacular.com/recipes/informationBulk?&includeNutrition=true&";

const apiKey = "2ebcbe4ee41f466ca81413d963a1a0d2";
export const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};
export const queryRandomRecipes = `${urlRandomRecipes}apiKey=${apiKey}`;
export const queryRecipeById = `${urlRecipeById}apiKey=${apiKey}&ids=`;
