import { useEffect, useLayoutEffect, useMemo } from "react";
import { createPortal } from "react-dom";

// Final de la intro: los botones de la barra lateral brotan del degradado del
// panel como gotas. Cada botón real nace dentro del panel con el color del
// degradado en ese punto, cruza su borde (derecha → izquierda) estirándose como
// una gota y, al asentarse, toma su color e icono. No hay copias ni capas
// aparte: lo que se mueve son los propios botones.
// Salen de uno en uno (de arriba abajo), cada uno con su propia duración.
// Orden de salida de los botones, de arriba (1) a abajo (5): 2, 4, 5, 1, 3.
const ORDER = [2, 4, 5, 1, 3];
const STEP = 260;

// Cada botón sale en su turno y con una duración algo distinta.
function timings(n) {
  return Array.from({ length: n }, (_, i) => {
    const rank = ORDER.length === n ? ORDER.indexOf(i + 1) : i;
    return {
      delay: rank * STEP,
      dur: 1000 + Math.round(Math.random() * 250),
    };
  });
}
const EASE = "ease-in-out";

// Carácter de cada botón (en el orden del DOM: logo, inicio, recetas, tema,
// perfil): desde dónde sale (dy: desnivel inicial en px), cuánto ondula por el
// camino (arc), si rebota al llegar y qué formas toma al viajar (border-radius).
const CHARACTER = [
  { bounce: false, dy: 0, arc: 0, shapes: null },
  { bounce: true, dy: -70, arc: 0, shapes: ["58% 42% 55% 45% / 45% 58% 42% 55%", "42% 58% 40% 60% / 60% 40% 58% 42%"] },
  { bounce: false, dy: 0, arc: 16, shapes: ["40% 60% 62% 38% / 55% 38% 62% 45%", "65% 35% 45% 55% / 40% 60% 40% 60%"] },
  { bounce: true, dy: 90, arc: -10, shapes: ["62% 38% 38% 62% / 38% 62% 38% 62%", "35% 65% 60% 40% / 50% 45% 55% 50%"] },
  { bounce: false, dy: -40, arc: -20, shapes: ["48% 52% 66% 34% / 60% 40% 60% 40%", "55% 45% 35% 65% / 42% 58% 42% 58%"] },
];

function gradientStops() {
  const css = getComputedStyle(document.documentElement).getPropertyValue("--grad");
  const stops = [...css.matchAll(/(#[0-9a-f]{3,8})\s+([\d.]+)%/gi)].map((m) => ({
    color: m[1],
    offset: parseFloat(m[2]) / 100,
  }));
  return stops.length
    ? stops
    : [
        { color: "#e3fb5f", offset: 0 },
        { color: "#c3b8f6", offset: 1 },
      ];
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? [...h].map((c) => c + c).join("") : h.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
}

// Color del degradado (135º sobre el rectángulo del panel) en un punto.
function colorAt(stops, rect, x, y) {
  const w = rect.width;
  const h = rect.height;
  const len = (w + h) * Math.SQRT1_2;
  const px = x - (rect.left + w / 2);
  const py = y - (rect.top + h / 2);
  const t = Math.min(1, Math.max(0, 0.5 + ((px + py) * Math.SQRT1_2) / len));
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i].offset) {
      const a = stops[i - 1];
      const b = stops[i];
      const k = (t - a.offset) / (b.offset - a.offset || 1);
      const ca = hexToRgb(a.color);
      const cb = hexToRgb(b.color);
      return ca.map((v, j) => Math.round(v + (cb[j] - v) * k));
    }
  }
  return hexToRgb(stops[stops.length - 1].color);
}

// Mide el estado final (barra visible) sin que llegue a pintarse.
function measure() {
  const root = document.documentElement;
  const app = document.querySelector(".app");
  const prev = root.dataset.intro;
  app.classList.add("intro-measure");
  delete root.dataset.intro;
  const main = (
    document.querySelector("main .view.welcome") || document.querySelector("main")
  ).getBoundingClientRect();
  const targets = [
    ...document.querySelectorAll(".site-header > :not(nav), .site-header nav a"),
  ]
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        el,
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        r: Math.max(r.width, r.height) / 2,
        bg: cs.backgroundColor,
        fg: cs.color,
        radius: cs.borderRadius,
        position: cs.position,
      };
    })
    .filter((t) => t.r > 0);
  root.dataset.intro = prev;
  getComputedStyle(app).gridTemplateColumns; // fija el estado de partida
  app.classList.remove("intro-measure");
  return { main, targets };
}

function LiquidWipe({ onDone }) {
  const info = useMemo(measure, []);
  const stops = useMemo(gradientStops, []);

  useLayoutEffect(() => {
    // La maquetación final arranca (con su transición) justo al montar.
    document.documentElement.dataset.intro = "grow";
  }, []);

  useEffect(() => {
    const { main, targets } = info;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.dataset.intro = "settle";
      const t = setTimeout(onDone, 30);
      return () => clearTimeout(t);
    }
    const edge = main.left;
    const plan = timings(targets.length);
    let total = 0;
    const anims = targets.map((t, i) => {
      const { delay, dur } = plan[i];
      total = Math.max(total, delay + dur);
      const from = edge + 18 - t.cx;
      const [r, g, b] = colorAt(stops, main, edge + 18, t.cy);
      const c0 = `rgb(${r}, ${g}, ${b})`;
      const bgEnd = t.bg === "rgba(0, 0, 0, 0)" ? `rgba(${r}, ${g}, ${b}, 0)` : t.bg;
      const tint = !t.el.classList.contains("brand");
      const { bounce, shapes, dy, arc } = CHARACTER[i % CHARACTER.length];
      // Cabeza redonda que viaja con un ligero estiramiento y, detrás, una gota
      // más pequeña que se queda rezagada (::before): el filtro "goo" las une con
      // un cuello que se afina hasta romperse, como en una gota de líquido.
      const head = [
        { offset: 0, x: from, y: dy, sx: 0.5, sy: 0.5 },
        { offset: 0.3, x: from * 0.45, y: dy * 0.4 + arc, sx: 1.1, sy: 0.94 },
        { offset: 0.62, x: -3, y: arc * 0.2, sx: 1.02, sy: 0.99 },
        { offset: 0.7, x: 0, y: 0, sx: 1, sy: 1 },
      ];
      const settle = bounce
        ? [
            { offset: 0.78, x: -12, y: 0, sx: 0.9, sy: 1.1 },
            { offset: 0.87, x: 4, y: 0, sx: 1.04, sy: 0.97 },
            { offset: 0.94, x: -2, y: 0, sx: 0.98, sy: 1.02 },
            { offset: 1, x: 0, y: 0, sx: 1, sy: 1 },
          ]
        : [{ offset: 1, x: 0, y: 0, sx: 1, sy: 1 }];
      const frames = [...head, ...settle].map((f) => {
        // El color pasa del del degradado al propio entre el 70 % y el final.
        const p = Math.round(Math.min(1, Math.max(0, (f.offset - 0.7) / 0.3)) * 100);
        const mix = (end) => `color-mix(in srgb, ${end} ${p}%, ${c0})`;
        let radius = {};
        if (shapes) {
          const k = f.offset < 0.22 ? t.radius : f.offset < 0.45 ? shapes[0] : f.offset < 0.62 ? shapes[1] : t.radius;
          radius = { borderRadius: k };
        }
        return {
          offset: f.offset,
          transform: `translate(${f.x}px, ${f.y}px) scale(${f.sx}, ${f.sy})`,
          ...radius,
          ...(tint
            ? {
                backgroundColor: mix(bgEnd),
                color: mix(t.fg),
                filter: f.offset < 0.66 ? "url(#liquid-goo)" : "none",
              }
            : {}),
        };
      });
      if (tint) {
        t.el.classList.add("liquid-bud");
        if (t.position === "static") t.el.classList.add("liquid-bud--rel");
        // La gota se queda atrás, en la dirección de la que viene el botón.
        const len = Math.hypot(from, dy) || 1;
        const ux = from / len;
        const uy = dy / len;
        const at = (d, k) => `translate(${ux * d}px, ${uy * d}px) scale(${k})`;
        const tail = [
          { offset: 0, transform: at(0, 0.5) },
          { offset: 0.2, transform: at(46, 0.6) },
          { offset: 0.45, transform: at(38, 0.5) },
          { offset: 0.62, transform: at(14, 0.8) },
          { offset: 0.7, transform: at(0, 1) },
          { offset: 1, transform: at(0, 1) },
        ];
        t.el.animate(tail, {
          duration: dur,
          delay,
          easing: EASE,
          fill: "both",
          pseudoElement: "::before",
        });
      }
      const a = t.el.animate(frames, { duration: dur, delay, easing: EASE, fill: "both" });
      a.onfinish = () => {
        a.cancel();
        t.el.classList.remove("liquid-bud", "liquid-bud--rel");
      };
      return a;
    });
    const timer = setTimeout(onDone, total + 50);
    return () => {
      clearTimeout(timer);
      anims.forEach((a) => a.cancel());
      targets.forEach((t) => t.el.classList.remove("liquid-bud", "liquid-bud--rel"));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtro "goo": desenfoque + umbral de alfa, como el efecto CSS de referencia.
  return createPortal(
    <svg className="goo-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="liquid-goo" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
          />
        </filter>
      </defs>
    </svg>,
    document.body
  );
}

export default LiquidWipe;
