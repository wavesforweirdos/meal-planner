import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { defaultRecipeBook } from "../../data";
import {
  authMessage,
  resetPassword,
  signInWithEmail,
  signInWithGoogle,
} from "../../utils/firebase";
import { ArrowIcon, CheckIcon, HeartIcon } from "../Icons";

const NOT_READY =
  "Google and email sign-in are not configured on this site yet.";


const GoogleMark = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.4z" />
    <path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.4 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0 0 12 23.5z" />
    <path fill="#FBBC05" d="M5.6 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3z" />
    <path fill="#EA4335" d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.4 11.4 0 0 0 12 .5 11.5 11.5 0 0 0 1.8 6.8l3.8 3C6.5 7.4 9 5.4 12 5.4z" />
  </svg>
);

// Tarjeta de acceso: la usan la home (diapositiva final en móvil) y la vista
// "login". Con Firebase: Google o email. Sin él: perfil local.
export function SignInCard({ className = "" }) {
  const { user, firebaseEnabled, checking } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [create, setCreate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const run = async (fn, okText = "") => {
    setBusy(true);
    setMessage("");
    try {
      await fn();
      if (okText) setMessage(okText);
    } catch (e) {
      setMessage(authMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const submitEmail = (e) => {
    e.preventDefault();
    run(() => signInWithEmail(email.trim(), password, create));
  };

  const forgot = () => {
    if (!email.trim()) return setMessage("Type your email first.");
    run(() => resetPassword(email.trim()), "Check your inbox for the reset link.");
  };

  return (
    <div className={`welcome__card${className ? ` ${className}` : ""}`} aria-labelledby="signin-title">
      <h2 id="signin-title" className="welcome__card-title">
        {user ? `Hi, ${user.name}` : "Sign in"}
      </h2>
      <p className="welcome__card-sub">
        The recipe book is open to everyone. Sign in to unlock your planner,
        shopping list and favourites.
      </p>

      {checking ? (
        <p className="welcome__note" role="status">Checking your session…</p>
      ) : (
        <>

          <form className="welcome__form" onSubmit={(e) => {
            if (firebaseEnabled) submitEmail(e);
            else {
              e.preventDefault();
              setMessage(NOT_READY);
            }
          }}>
            <label htmlFor="signin-email" className="welcome__label">Email</label>
            <input id="signin-email" className="welcome__input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="signin-password" className="welcome__label">Password</label>
            <input id="signin-password" className="welcome__input" type="password" autoComplete={create ? "new-password" : "current-password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="cta" disabled={busy}>
              {create ? "Create account" : "Sign in"} <ArrowIcon />
            </button>
          </form>

          <p className="welcome__links">
            <button type="button" className="link-btn" onClick={() => { setCreate((v) => !v); setMessage(""); }}>
              {create ? "I already have an account" : "Create an account"}
            </button>
            {!create && (
              <button type="button" className="link-btn" onClick={forgot}>Forgot password?</button>
            )}
          </p>

          <p className="welcome__or"><span>or</span></p>

          <div className="social">
            <button type="button" className="social__btn" disabled={busy} onClick={() => (firebaseEnabled ? run(signInWithGoogle) : setMessage(NOT_READY))}>
              <GoogleMark /> Continue with Google
            </button>
          </div>
        </>
      )}

      {message && (
        <p className="notice" role="alert">{message}</p>
      )}
    </div>
  );
}

// Inicio: explica la aplicación con pequeñas ilustraciones y permite entrar.
// Con Firebase: Google o email. Sin él: perfil local de este navegador.
function Welcome() {
  const samples = defaultRecipeBook.slice(0, 4);
  // Móvil: la home es un carrusel de diapositivas (título, herramientas, acceso).
  const sliderRef = useRef(null);
  const [slide, setSlide] = useState(0);
  const SLIDES = ["Welcome", "What you can do", "Sign in"];
  const onSlide = () => {
    const el = sliderRef.current;
    if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };
  // Avance automático (solo móvil): pasa de diapositiva cada 5 s y se detiene en
  // cuanto la persona toca, desliza o escribe, o al llegar al acceso.
  const autoplay = useRef(true);
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return undefined;
    const stop = () => {
      autoplay.current = false;
    };
    el.addEventListener("pointerdown", stop);
    el.addEventListener("wheel", stop, { passive: true });
    // Solo si la persona entra en un campo o botón (no por el foco al cambiar de vista).
    const onFocusIn = (e) => {
      if (e.target.closest("input, select, textarea, button, a")) stop();
    };
    el.addEventListener("focusin", onFocusIn);
    const timer = setInterval(() => {
      const mobile = window.matchMedia("(max-width: 699px)").matches;
      if (!mobile || !autoplay.current) return;
      const next = Math.round(el.scrollLeft / el.clientWidth) + 1;
      if (next >= SLIDES.length) {
        autoplay.current = false;
        return;
      }
      // Con "reducir movimiento" el cambio es instantáneo, sin animación.
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
    }, 5000);
    return () => {
      clearInterval(timer);
      el.removeEventListener("pointerdown", stop);
      el.removeEventListener("wheel", stop);
      el.removeEventListener("focusin", onFocusIn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goSlide = (i) => {
    const el = sliderRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="view welcome" aria-labelledby="view-title">
      <div className="welcome__grid" ref={sliderRef} onScroll={onSlide}>
        <div className="welcome__hero">
          <div className="welcome__slide welcome__slide--intro">
            <h1 id="view-title" tabIndex="-1" className="welcome__title">
              Plan your week,
              <br />
              one plate at a time.
            </h1>
            <p className="welcome__lead">
              Pick recipes you love, drop them into your calendar and get the
              shopping list for free.
            </p>
          </div>

          <ol className="steps-demo welcome__slide" aria-label="How it works">
            <li className="step">
              <div className="step__art step__art--plates" aria-hidden="true">
                {samples.slice(0, 3).map((r) => (
                  <img key={r.id} src={r.image} alt="" width="64" height="64" />
                ))}
                <span className="step__heart">
                  <HeartIcon filled />
                </span>
              </div>
              <h2 className="step__title">
                <span className="step__num">1</span> Discover
              </h2>
              <p>Browse the recipe book, filter by meal or diet and save favourites.</p>
            </li>

            <li className="step">
              <div className="step__art step__art--cal" aria-hidden="true">
                {Array.from({ length: 15 }, (_, i) => {
                  const filled = { 1: "breakfast", 4: "lunch", 7: "snack", 8: "dinner", 12: "lunch" }[i];
                  const sample = { 1: 0, 4: 1, 7: 2, 8: 3, 12: 1 }[i];
                  return (
                    <span key={i} className={filled ? `cell-demo cell-demo--${filled}` : "cell-demo"}>
                      {filled && <img src={samples[sample].image} alt="" width="26" height="26" />}
                    </span>
                  );
                })}
              </div>
              <h2 className="step__title">
                <span className="step__num">2</span> Plan
              </h2>
              <p>Drag recipes onto breakfast, lunch, snack or dinner. Rename meals and add your own.</p>
            </li>

            <li className="step">
              <div className="step__art step__art--list" aria-hidden="true">
                {[72, 54, 84].map((w, i) => (
                  <span key={w} className="list-demo">
                    <span className={`list-demo__box${i !== 1 ? " list-demo__box--on" : ""}`}>
                      {i !== 1 && <CheckIcon />}
                    </span>
                    <span className="list-demo__line" style={{ width: `${w}%` }} />
                  </span>
                ))}
              </div>
              <h2 className="step__title">
                <span className="step__num">3</span> Shop
              </h2>
              <p>Every ingredient of your plan, added up and grouped by aisle.</p>
            </li>
          </ol>
        </div>

        <SignInCard className="welcome__slide" />
      </div>

      <div className="slider-dots" role="group" aria-label="Home slides">
        {SLIDES.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-current={slide === i ? "true" : undefined}
            onClick={() => {
              autoplay.current = false;
              goSlide(i);
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default Welcome;
