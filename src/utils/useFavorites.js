import { useSyncExternalStore } from "react";
import { onSessionChange, userKey } from "./session";
import { readJSON, writeJSON } from "./storage";

const KEY = "favorites";

function read() {
  const saved = readJSON(userKey(KEY), []);
  return Array.isArray(saved) ? saved.filter((r) => r && typeof r === "object" && r.id) : [];
}

// Pequeño almacén compartido: todas las vistas ven los mismos favoritos del
// perfil activo. Guarda la receta completa, así se pueden mostrar sin consultar.
let snapshot = read();
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

// Al cambiar de perfil se cargan sus favoritos.
onSessionChange(() => {
  snapshot = read();
  emit();
});

export function toggleFavorite(recipe) {
  snapshot = snapshot.some((r) => r.id === recipe.id)
    ? snapshot.filter((r) => r.id !== recipe.id)
    : [...snapshot, recipe];
  writeJSON(userKey(KEY), snapshot);
  emit();
}

export function useFavorites() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => snapshot
  );
}
