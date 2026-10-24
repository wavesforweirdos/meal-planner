import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext, AuthProvider } from "./context/AuthContext";
import { RecipeContextProvider } from "./context/RecipeContext";
import { PlannerContext, PlannerContextProvider } from "./context/PlannerContext";
import Planner from "./components/Planner/Planner";
import RecipesPanel from "./components/Recipes/RecipesPanel";
import ShoppingList from "./components/ShoppingList/ShoppingList";
import Welcome, { SignInCard } from "./components/Welcome/Welcome";
import RecipeDialog from "./components/Dialogs/RecipeDialog";
import AddToPlanDialog from "./components/Dialogs/AddToPlanDialog";
import ProfileMenu from "./components/ProfileMenu";
import IconButton from "./components/IconButton";
import Logo from "./components/Logo";
import { PRIVATE_VIEWS, PUBLIC_VIEWS, useView } from "./utils/useView";
import { useMediaQuery } from "./utils/useMediaQuery";
import { parseJoin } from "./utils/sharing";
import {
  ArrowIcon,
  CalendarIcon,
  CartIcon,
  HomeIcon,
  MoonIcon,
  RecipeIcon,
  SunIcon,
} from "./components/Icons";

const ICONS = {
  home: HomeIcon,
  calendar: CalendarIcon,
  recipe: RecipeIcon,
  cart: CartIcon,
};

// Región `aria-live` única: anuncia altas y bajas del plan a lectores de pantalla.
function Announcer() {
  const { announcement } = useContext(PlannerContext);
  return (
    <p className="visually-hidden" role="status" aria-live="polite">
      {announcement}
    </p>
  );
}

// Marco común: barra lateral (o inferior en móvil), contenido y pie.
function Layout({ views, view, dark, onToggleTheme, badge, account, children }) {
  const first = useRef(true);

  // Al cambiar de vista: arriba del todo, título del documento y foco en el
  // encabezado de la nueva vista (para teclado y lectores de pantalla).
  useEffect(() => {
    const label = views.find((v) => v.id === view)?.label ?? "";
    document.title = `${label} · Meal Planner`;
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById("view-title")?.focus({ preventScroll: true });
  }, [view, views]);

  return (
    <div className="app">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("view-title")?.focus();
        }}
      >
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href={`#${views[0].id}`} aria-label="Meal planner, home" data-tip="Meal Planner">
          <Logo />
        </a>
        <nav aria-label="Views">
          <ul>
            {views.filter((v) => !v.hidden).map((v) => {
              const Icon = ICONS[v.icon];
              return (
                <li key={v.id}>
                  <a
                    href={`#${v.id}`}
                    data-tip={v.label}
                    aria-current={view === v.id ? "page" : undefined}
                  >
                    <span className="nav-icon">
                      <Icon />
                    </span>
                    <span className="nav-label">{v.label}</span>
                    {v.id === "plan" && badge > 0 && (
                      <span className="count">
                        {badge}
                        <span className="visually-hidden"> recipes planned</span>
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <IconButton
          label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="theme-toggle"
          tooltip="custom"
          onClick={onToggleTheme}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </IconButton>
        {account}
      </header>

      <main id="main">{children}</main>

      <footer className="site-footer">
        <p>
          Meal Planner · Recipes by{" "}
          <a href="https://spoonacular.com/food-api/">Spoonacular</a>
        </p>
      </footer>

      <RecipeDialog />
    </div>
  );
}

// Con sesión: planificador, recetas y lista de la compra.
const PENDING_JOIN = "meal-planner:pending-join";

function PrivateShell() {
  const view = useView(PRIVATE_VIEWS);
  const { plannedRecipes, settings, updateSettings, joinShare } = useContext(PlannerContext);
  const [toast, setToast] = useState("");

  // Enlace de invitación (#join=...): une a la persona al plan compartido.
  useEffect(() => {
    const run = async () => {
      let id = parseJoin();
      if (!id) {
        try {
          id = sessionStorage.getItem(PENDING_JOIN);
        } catch {
          id = null;
        }
      }
      if (!id) return;
      try {
        sessionStorage.removeItem(PENDING_JOIN);
      } catch {
        // sin almacenamiento
      }
      const ok = await joinShare(id);
      window.location.hash = "plan";
      setToast(ok ? "You joined the shared plan." : "That invitation is not valid any more.");
      setTimeout(() => setToast(""), 5000);
    };
    run();
    window.addEventListener("hashchange", run);
    return () => window.removeEventListener("hashchange", run);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  const dark = settings.theme === "system" ? systemDark : settings.theme === "dark";

  return (
    <>
      <Layout
        views={PRIVATE_VIEWS}
        view={view}
        dark={dark}
        onToggleTheme={() => updateSettings({ theme: dark ? "light" : "dark" })}
        badge={plannedRecipes.length}
        account={<ProfileMenu />}
      >
        {view === "plan" && <Planner />}
        {view === "recipes" && <RecipesPanel />}
        {view === "shopping" && <ShoppingList />}
      </Layout>
      <AddToPlanDialog />
      <Announcer />
      {toast && (
        <p className="toast" role="status">
          {toast}
        </p>
      )}
    </>
  );
}

// Solo el acceso, centrado (sin la explicación de la home).
function LoginView() {
  return (
    <section className="view login" aria-labelledby="view-title">
      <h1 id="view-title" tabIndex="-1" className="visually-hidden">
        Sign in
      </h1>
      <SignInCard className="login__card" />
    </section>
  );
}

// Sin sesión: la home (con el acceso) y el recetario en solo lectura.
function PublicShell() {
  const view = useView(PUBLIC_VIEWS);
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  // Sin cuenta el tema se guarda en el navegador (null = el del sistema).
  const [guestTheme, setGuestTheme] = useState(() => {
    try {
      const t = localStorage.getItem("meal-planner:guest-theme");
      return t === "light" || t === "dark" ? t : null;
    } catch {
      return null;
    }
  });
  const dark = guestTheme ? guestTheme === "dark" : systemDark;

  useEffect(() => {
    const root = document.documentElement;
    if (guestTheme) root.dataset.theme = guestTheme;
    else delete root.dataset.theme;
    try {
      if (guestTheme) localStorage.setItem("meal-planner:guest-theme", guestTheme);
    } catch {
      // sin almacenamiento
    }
  }, [guestTheme]);

  return (
    <Layout
      views={PUBLIC_VIEWS}
      view={view}
      dark={dark}
      onToggleTheme={() => setGuestTheme(dark ? "light" : "dark")}
      badge={0}
      account={
        <a className="signin-link" href="#login" data-tip="Sign in" aria-label="Sign in">
          <ArrowIcon />
        </a>
      }
    >
      {view === "home" && <Welcome />}
      {view === "login" && <LoginView />}
      {view === "recipes" && <RecipesPanel />}
    </Layout>
  );
}

function Gate() {
  const { user, checking } = useContext(AuthContext);

  // Sin sesión, una invitación se guarda y se lleva a la persona al acceso.
  useEffect(() => {
    if (user || checking) return;
    const id = parseJoin();
    if (!id) return;
    try {
      sessionStorage.setItem(PENDING_JOIN, id);
    } catch {
      // sin almacenamiento
    }
    window.location.hash = "login";
  }, [user, checking]);

  return (
    <RecipeContextProvider key={user?.id ?? "guest"}>
      {user ? (
        <PlannerContextProvider key={user.id}>
          <PrivateShell />
        </PlannerContextProvider>
      ) : (
        <PublicShell />
      )}
    </RecipeContextProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

export default App;
