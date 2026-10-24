const STORAGE_KEY = "spoonacular-api-key";

export function loadApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveApiKey(key) {
  try {
    if (key) localStorage.setItem(STORAGE_KEY, key);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // sin almacenamiento disponible: la clave solo vive mientras dure la sesión
  }
}
