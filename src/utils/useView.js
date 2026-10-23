import { useEffect, useState } from "react";

// Con sesión: planificador, recetas y lista de la compra.
export const PRIVATE_VIEWS = [
  { id: "plan", label: "Plan", icon: "calendar" },
  { id: "recipes", label: "Recipes", icon: "recipe" },
  { id: "shopping", label: "Shopping list", icon: "cart" },
];

// Sin sesión: la home (con el acceso) y el recetario.
export const PUBLIC_VIEWS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "recipes", label: "Recipes", icon: "recipe" },
  // Solo el acceso: no aparece en la navegación (se llega desde el botón de entrar).
  { id: "login", label: "Sign in", hidden: true },
];

// La vista activa vive en el hash (#plan, #recipes…): funciona en hosting
// estático y el botón "atrás" del navegador cambia de vista. Si el hash no
// pertenece a las vistas disponibles, se usa la primera.
export function useView(views) {
  const read = () => {
    const id = window.location.hash.slice(1);
    return views.some((v) => v.id === id) ? id : views[0].id;
  };
  const [view, setView] = useState(read);
  useEffect(() => {
    const onChange = () => setView(read());
    onChange();
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views]);
  return view;
}

export const goTo = (id) => {
  window.location.hash = id;
};
