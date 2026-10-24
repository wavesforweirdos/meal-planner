export const MEALS = [
  { id: "breakfast", label: "Breakfast", dishTypes: ["breakfast", "morning meal", "brunch"] },
  { id: "lunch", label: "Lunch", dishTypes: ["lunch"] },
  { id: "snack", label: "Snack", dishTypes: ["snack", "dessert", "appetizer", "antipasti", "starter", "fingerfood"] },
  { id: "dinner", label: "Dinner", dishTypes: ["dinner", "main course"] },
];

export const DIETS = [
  { id: "vegetarian", label: "Vegetarian", test: (r) => r.vegetarian },
  { id: "vegan", label: "Vegan", test: (r) => r.vegan },
  { id: "glutenFree", label: "Gluten free", test: (r) => r.glutenFree },
  { id: "dairyFree", label: "Dairy free", test: (r) => r.dairyFree },
  { id: "veryHealthy", label: "Healthy", test: (r) => r.veryHealthy },
];

export const cleanTitle = (title = "") =>
  title.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();

export const matchesMeal = (recipe, mealId) => {
  const meal = MEALS.find((m) => m.id === mealId);
  const types = recipe.dishTypes ?? [];
  return !!meal && types.some((t) => meal.dishTypes.includes(t));
};

// Franja que se sugiere para una receta (la primera que encaje).
export const mealOf = (recipe) =>
  MEALS.find((m) => matchesMeal(recipe, m.id))?.id ?? "lunch";

export const caloriesOf = (recipe) => {
  const kcal = recipe.nutrition?.nutrients?.find((n) => n.name === "Calories");
  return kcal ? Math.round(kcal.amount) : null;
};

// pricePerServing viene en céntimos de dólar.
export const priceOf = (recipe) =>
  typeof recipe.pricePerServing === "number"
    ? `$${(recipe.pricePerServing / 100).toFixed(2)}`
    : null;

export const stepsOf = (recipe) => recipe.analyzedInstructions?.[0]?.steps ?? [];

const round = (n) => Math.round(n * 100) / 100;

// Suma los ingredientes de las recetas planificadas, agrupados por pasillo.
export function buildShoppingList(recipes) {
  const items = new Map();
  for (const recipe of recipes) {
    for (const ing of recipe.extendedIngredients ?? []) {
      const unit = ing.measures?.metric?.unitShort ?? ing.unit ?? "";
      const amount = ing.measures?.metric?.amount ?? ing.amount ?? 0;
      // "Tbsp" y "Tbsps" son la misma unidad: se agrupan juntas.
      const key = `${ing.name}|${unit.replace(/s$/, "")}`;
      const current = items.get(key);
      if (current) current.amount += amount;
      else
        items.set(key, {
          key,
          name: ing.name,
          unit,
          amount,
          aisle: (ing.aisle ?? "Other").split(";")[0],
        });
    }
  }
  const byAisle = new Map();
  for (const item of items.values()) {
    const list = byAisle.get(item.aisle) ?? [];
    list.push({ ...item, amount: round(item.amount) });
    byAisle.set(item.aisle, list);
  }
  return [...byAisle.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([aisle, list]) => ({
      aisle,
      items: list.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}
