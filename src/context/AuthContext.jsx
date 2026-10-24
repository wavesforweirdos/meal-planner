import { createContext, useEffect, useState } from "react";
import { firebaseEnabled, signOutFirebase, watchAuth } from "../utils/firebase";
import { getUid, setSession } from "../utils/session";
import { readJSON, writeJSON } from "../utils/storage";

export const AuthContext = createContext();

const USERS_KEY = "meal-planner:users";
const LEGACY = ["plan", "checked", "settings", "favorites"];

// Datos guardados antes de que existieran los perfiles: el primero en entrar
// los hereda para no perder nada.
function adoptLegacyData(id) {
  for (const name of LEGACY) {
    try {
      const old = localStorage.getItem(`meal-planner-${name}`);
      if (old !== null) localStorage.setItem(`meal-planner:${id}:${name}`, old);
    } catch {
      // sin almacenamiento
    }
  }
}

// Con Firebase configurado la sesión es la de la cuenta (Google o email).
// Sin él se usan perfiles locales de este navegador, solo para desarrollo y demo.
export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = readJSON(USERS_KEY, []);
    return Array.isArray(saved) ? saved : [];
  });
  const [userId, setUserId] = useState(() => (firebaseEnabled ? "" : getUid()));
  const [account, setAccount] = useState(null);
  // Con Firebase, hasta que responde no se sabe si hay sesión.
  const [checking, setChecking] = useState(firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) return undefined;
    return watchAuth((u) => {
      setSession(u ? u.id : "");
      setAccount(u);
      setUserId(u ? u.id : "");
      setChecking(false);
    });
  }, []);

  // Quien ha iniciado sesión alguna vez ya conoce la app: no verá la intro animada.
  useEffect(() => {
    if (!userId) return;
    try {
      localStorage.setItem("meal-planner:signed-in-before", "1");
    } catch {
      // sin almacenamiento
    }
  }, [userId]);

  const localUser = users.find((u) => u.id === userId) ?? null;
  const base = firebaseEnabled ? account : localUser;

  // Avatar elegido por la persona: tiene prioridad sobre la foto de la cuenta.
  const [avatarTick, setAvatarTick] = useState(0);
  const avatarKey = base ? `meal-planner:avatar:${base.id}` : "";
  const chosen = avatarKey
    ? (() => {
        try {
          return localStorage.getItem(avatarKey) ?? "";
        } catch {
          return "";
        }
      })()
    : "";
  // `avatarTick` fuerza la relectura al cambiar el avatar.
  void avatarTick;
  // "none" = silueta por defecto, aunque el perfil o la cuenta traigan emoji o foto.
  // Un valor "data:..." es una imagen propia; cualquier otro, un emoji.
  const hasPhoto = Boolean(base?.photo);
  const isImage = chosen.startsWith("data:");
  const custom = Boolean(chosen && chosen !== "none") || Boolean(base?.emoji && chosen !== "none");
  const user =
    base &&
    (chosen === "none"
      ? { ...base, emoji: "", photo: "", hasPhoto, custom: false }
      : chosen
        ? { ...base, emoji: isImage ? "" : chosen, photo: isImage ? chosen : "", hasPhoto, custom }
        : { ...base, hasPhoto, custom });

  // "" = volver a lo que traiga la cuenta (foto o avatar inicial); "none" = silueta.
  const setAvatar = (emoji) => {
    if (!avatarKey) return;
    try {
      if (emoji) localStorage.setItem(avatarKey, emoji);
      else localStorage.removeItem(avatarKey);
    } catch {
      // sin almacenamiento
    }
    setAvatarTick((t) => t + 1);
  };

  // Solo perfiles locales (sin Firebase).
  const signIn = (name, emoji = "") => {
    const clean = name.trim().slice(0, 24);
    if (!clean) return;
    let profile = users.find((u) => u.name.toLowerCase() === clean.toLowerCase());
    if (!profile) {
      profile = { id: `u${Date.now().toString(36)}`, name: clean, emoji };
      if (users.length === 0) adoptLegacyData(profile.id);
      const next = [...users, profile];
      setUsers(next);
      writeJSON(USERS_KEY, next);
    }
    setSession(profile.id);
    setUserId(profile.id);
  };

  const signOut = async () => {
    if (firebaseEnabled) await signOutFirebase();
    setSession("");
    setUserId("");
    setAccount(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, users, signIn, signOut, setAvatar, checking, firebaseEnabled }}
    >
      {children}
    </AuthContext.Provider>
  );
}
