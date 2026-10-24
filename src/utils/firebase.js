// Firebase Auth, cargado solo cuando hay configuración (variables VITE_FIREBASE_*).
// Sin ella la app sigue funcionando con perfiles locales (ver AuthContext).
const env = import.meta.env;

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(config.apiKey && config.projectId && config.appId);

let ready;

// Carga el SDK una sola vez.
function load() {
  ready ??= import("firebase/app").then(async ({ initializeApp }) => {
    const auth = await import("firebase/auth");
    const app = initializeApp(config);
    return { auth, app, instance: auth.getAuth(app) };
  });
  return ready;
}

const toUser = (u) =>
  u && {
    id: u.uid,
    name: u.displayName || u.email?.split("@")[0] || "Friend",
    email: u.email ?? "",
    photo: u.photoURL ?? "",
    emoji: "",
  };

// Base de datos (Firestore) para planes compartidos; carga el SDK solo si hace falta.
export async function loadFirestore() {
  const { app } = await load();
  const fs = await import("firebase/firestore");
  return { fs, db: fs.getFirestore(app) };
}

// Avisa del usuario actual y de cada cambio. Devuelve la función para dejar de escuchar.
export function watchAuth(callback) {
  let stop = () => {};
  let cancelled = false;
  load().then(({ auth, instance }) => {
    if (cancelled) return;
    stop = auth.onAuthStateChanged(instance, (u) => callback(toUser(u)));
  });
  return () => {
    cancelled = true;
    stop();
  };
}

async function popup() {
  const { auth, instance } = await load();
  await auth.signInWithPopup(instance, new auth.GoogleAuthProvider());
}

export const signInWithGoogle = () => popup();

export async function signInWithEmail(email, password, create) {
  const { auth, instance } = await load();
  if (create) await auth.createUserWithEmailAndPassword(instance, email, password);
  else await auth.signInWithEmailAndPassword(instance, email, password);
}

export async function resetPassword(email) {
  const { auth, instance } = await load();
  await auth.sendPasswordResetEmail(instance, email);
}

export async function signOutFirebase() {
  const { auth, instance } = await load();
  await auth.signOut(instance);
}

// Mensajes legibles para los errores más comunes de Firebase.
export function authMessage(error) {
  const code = error?.code ?? "";
  if (code.includes("popup-closed") || code.includes("cancelled")) return "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Email or password is not correct.";
  if (code.includes("email-already-in-use")) return "That email already has an account. Try signing in.";
  if (code.includes("weak-password")) return "Use a password of at least 6 characters.";
  if (code.includes("invalid-email")) return "That email does not look right.";
  if (code.includes("operation-not-allowed")) return "That sign-in method is not enabled yet.";
  if (code.includes("unauthorized-domain")) return "This website is not authorised for sign-in yet.";
  if (code.includes("network")) return "Network problem. Check your connection and try again.";
  return "Could not sign in. Please try again.";
}
