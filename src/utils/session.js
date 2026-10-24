// Sesión local: no hay servidor ni contraseñas. "Iniciar sesión" elige un perfil
// guardado en este navegador, y cada perfil tiene sus propios datos.
const SESSION_KEY = "meal-planner:session";

let uid = "";
try {
  uid = localStorage.getItem(SESSION_KEY) ?? "";
} catch {
  uid = "";
}

const listeners = new Set();

export const getUid = () => uid;

// Clave de almacenamiento propia del perfil activo.
export const userKey = (name) => `meal-planner:${uid}:${name}`;

export function setSession(id) {
  uid = id || "";
  try {
    if (uid) localStorage.setItem(SESSION_KEY, uid);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // sin almacenamiento: la sesión dura lo que la pestaña
  }
  listeners.forEach((l) => l());
}

export function onSessionChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
