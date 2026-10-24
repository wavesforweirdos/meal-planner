// Planes compartidos: un documento que varias personas editan a la vez.
// Con Firebase se guarda en Firestore (tiempo real entre dispositivos). Sin él,
// en modo demo, se guarda en este navegador y se sincroniza entre pestañas.
import { firebaseEnabled, loadFirestore } from "./firebase";

// Una receta completa pesa decenas de KB; el documento compartido guarda una
// versión ligera (sin nutrición detallada ni textos largos) para no pasar del
// límite de 1 MB de Firestore.
export function slimRecipe(recipe) {
  const {
    id, title, image, dishTypes, readyInMinutes, servings, pricePerServing,
    vegetarian, vegan, glutenFree, dairyFree, veryHealthy,
    extendedIngredients, analyzedInstructions, sourceUrl,
  } = recipe;
  const kcal = recipe.nutrition?.nutrients?.find((n) => n.name === "Calories");
  return {
    id, title, image, dishTypes, readyInMinutes, servings, pricePerServing,
    vegetarian, vegan, glutenFree, dairyFree, veryHealthy, sourceUrl,
    nutrition: kcal ? { nutrients: [kcal] } : undefined,
    extendedIngredients: (extendedIngredients ?? []).map((i) => ({
      id: i.id, name: i.name, aisle: i.aisle, amount: i.amount, unit: i.unit, measures: i.measures,
    })),
    analyzedInstructions: (analyzedInstructions ?? []).map((a) => ({
      steps: (a.steps ?? []).map((s) => ({ number: s.number, step: s.step })),
    })),
  };
}

export const slimPlan = (plan) =>
  plan.map((day) =>
    Object.fromEntries(
      Object.entries(day).map(([meal, list]) => [meal, list.map(slimRecipe)])
    )
  );

// JSON con las claves ordenadas: así dos copias iguales dan siempre el mismo
// texto aunque Firestore reordene los campos.
const sortKeys = (v) =>
  Array.isArray(v)
    ? v.map(sortKeys)
    : v && typeof v === "object"
      ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]))
      : v;
export const canonical = (v) => JSON.stringify(sortKeys(JSON.parse(JSON.stringify(v))));

const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

// Firestore no admite `undefined`: se limpia antes de guardar.
const clean = (value) => JSON.parse(JSON.stringify(value));

// ---------------------------------------------------------------------------
// Backend local (demo): localStorage + evento `storage` entre pestañas
// ---------------------------------------------------------------------------
const localKey = (id) => `meal-planner:shared:${id}`;
const readLocal = (id) => {
  try {
    return JSON.parse(localStorage.getItem(localKey(id)));
  } catch {
    return null;
  }
};
const writeLocal = (id, doc) => {
  try {
    localStorage.setItem(localKey(id), JSON.stringify(doc));
  } catch {
    // sin almacenamiento
  }
};
const localListeners = new Map();
const emitLocal = (id) => localListeners.get(id)?.forEach((cb) => cb(readLocal(id)));

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key?.startsWith("meal-planner:shared:")) emitLocal(e.key.split(":").pop());
  });
}

const localBackend = {
  async create(doc) {
    const id = newId();
    writeLocal(id, doc);
    return id;
  },
  async join(id, uid, name) {
    const doc = readLocal(id);
    if (!doc) return false;
    if (!doc.members.includes(uid)) {
      doc.members.push(uid);
      doc.names = { ...doc.names, [uid]: name };
      writeLocal(id, doc);
      emitLocal(id);
    }
    return true;
  },
  subscribe(id, cb) {
    const set = localListeners.get(id) ?? new Set();
    set.add(cb);
    localListeners.set(id, set);
    queueMicrotask(() => cb(readLocal(id)));
    return () => set.delete(cb);
  },
  async write(id, patch) {
    const doc = readLocal(id);
    if (!doc) return;
    writeLocal(id, { ...doc, ...patch });
    emitLocal(id);
  },
  async leave(id, uid) {
    const doc = readLocal(id);
    if (!doc) return;
    doc.members = doc.members.filter((m) => m !== uid);
    if (doc.members.length === 0) localStorage.removeItem(localKey(id));
    else writeLocal(id, doc);
    emitLocal(id);
  },
};

// ---------------------------------------------------------------------------
// Backend Firestore
// ---------------------------------------------------------------------------
const firestoreBackend = {
  async create(doc) {
    const { fs, db } = await loadFirestore();
    const id = newId();
    await fs.setDoc(fs.doc(db, "shared", id), clean(doc));
    return id;
  },
  async join(id, uid, name) {
    const { fs, db } = await loadFirestore();
    try {
      await fs.updateDoc(fs.doc(db, "shared", id), {
        members: fs.arrayUnion(uid),
        [`names.${uid}`]: name,
      });
      return true;
    } catch {
      return false;
    }
  },
  subscribe(id, cb) {
    let stop = () => {};
    let cancelled = false;
    loadFirestore().then(({ fs, db }) => {
      if (cancelled) return;
      stop = fs.onSnapshot(
        fs.doc(db, "shared", id),
        (snap) => cb(snap.exists() ? snap.data() : null),
        () => cb(null)
      );
    });
    return () => {
      cancelled = true;
      stop();
    };
  },
  async write(id, patch) {
    const { fs, db } = await loadFirestore();
    await fs.updateDoc(fs.doc(db, "shared", id), clean(patch));
  },
  async leave(id, uid) {
    const { fs, db } = await loadFirestore();
    const ref = fs.doc(db, "shared", id);
    await fs.updateDoc(ref, { members: fs.arrayRemove(uid) });
  },
};

export const sharingBackend = firebaseEnabled ? firestoreBackend : localBackend;
export const sharingIsLocal = !firebaseEnabled;

// Enlace de invitación: abre la app y une a la persona al plan.
export const inviteLink = (id) =>
  `${window.location.origin}${window.location.pathname}#join=${id}`;

export const parseJoin = () => {
  const m = window.location.hash.match(/^#join=([\w-]+)$/);
  return m ? m[1] : null;
};
