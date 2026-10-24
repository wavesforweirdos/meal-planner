import { useContext, useEffect, useRef, useState } from "react";
import { PlannerContext } from "../../context/PlannerContext";
import { useMediaQuery } from "../../utils/useMediaQuery";
import MealCell from "./MealCell";
import RecipeDrawer from "./RecipeDrawer";
import SettingsDialog from "../Dialogs/SettingsDialog";
import ShareDialog from "../Dialogs/ShareDialog";
import IconButton from "../IconButton";
import { GearIcon, MealGlyph, PlusIcon, ShareIcon, TrashIcon, UsersIcon } from "../Icons";

// Hueco que se sugiere si nadie ha elegido uno: el primero con sitio desde hoy.
function defaultTarget(slotOf, week, meals, max) {
  const start = Math.max(0, week.findIndex((d) => d.isToday));
  for (let i = 0; i < 7; i++) {
    const dayIndex = (start + i) % 7;
    for (const meal of meals)
      if (slotOf(dayIndex, meal.id).length < max)
        return { dayIndex, mealId: meal.id };
  }
  return { dayIndex: start, mealId: meals[0].id };
}

// Días visibles a la vez en móvil (el calendario se desplaza en horizontal).
const VISIBLE_DAYS = 2;

function Planner() {
  const { week, slotOf, plannedRecipes, clearPlan, activeMeals, maxPerSlot, shareId, shareInfo } =
    useContext(PlannerContext);
  const isMobile = useMediaQuery("(max-width: 699px)");
  const [picked, setPicked] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [firstVisible, setFirstVisible] = useState(0);
  const fabRef = useRef(null);
  const scrollerRef = useRef(null);
  const firstRender = useRef(true);

  const fallback = defaultTarget(slotOf, week, activeMeals, maxPerSlot);
  const target =
    picked && activeMeals.some((m) => m.id === picked.mealId) ? picked : fallback;
  const first = week[0];
  const last = week[6];
  const title =
    first.month === last.month
      ? `${first.month} ${first.num}–${last.num}`
      : `${first.monthShort} ${first.num} – ${last.monthShort} ${last.num}`;

  // Elegir un hueco lo marca; en móvil, además, abre la hoja con las recetas.
  const select = (dayIndex, mealId) => {
    setPicked({ dayIndex, mealId });
    if (isMobile) setSheetOpen(true);
  };

  // Foco en móvil: al abrir la hoja va a su título; al cerrarla vuelve al botón.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!isMobile) return;
    if (sheetOpen) {
      document.getElementById("drawer-title")?.focus({ preventScroll: true });
    } else {
      fabRef.current?.focus({ preventScroll: true });
    }
  }, [sheetOpen, isMobile]);

  // Ancho de un día (columna + hueco) en el calendario desplazable.
  const dayWidth = () => {
    const cols = scrollerRef.current?.querySelectorAll(".daycol");
    if (!cols || cols.length < 2) return 0;
    return cols[1].getBoundingClientRect().left - cols[0].getBoundingClientRect().left;
  };

  const onScroll = () => {
    const width = dayWidth();
    if (!width) return;
    const index = Math.round(scrollerRef.current.scrollLeft / width);
    setFirstVisible(Math.max(0, Math.min(7 - VISIBLE_DAYS, index)));
  };

  const goToDay = (index) => {
    const width = dayWidth();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollerRef.current?.scrollTo({
      left: Math.min(index, 7 - VISIBLE_DAYS) * width,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  // En móvil arranca mostrando el día de hoy.
  useEffect(() => {
    if (!isMobile) return;
    const today = Math.max(0, week.findIndex((d) => d.isToday));
    const width = dayWidth();
    if (width && scrollerRef.current)
      scrollerRef.current.scrollLeft = Math.min(today, 7 - VISIBLE_DAYS) * width;
    onScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const showDrawer = !isMobile || sheetOpen;

  return (
    <section className="view planner" aria-labelledby="view-title">
      <div className="planner__main">
        <div className="toolbar">
          <h1 id="view-title" tabIndex="-1" className="toolbar__title">
            <span className="visually-hidden">Week of </span>
            {title}
          </h1>
          <div className="toolbar__actions">
            <IconButton
              label={
                shareId
                  ? `Shared with ${shareInfo.members.length || 1} ${shareInfo.members.length === 1 ? "person" : "people"}`
                  : "Share plan"
              }
              onClick={() => setShareOpen(true)}
            >
              {shareId ? <UsersIcon /> : <ShareIcon />}
            </IconButton>
            <IconButton label="Settings" onClick={() => setSettingsOpen(true)}>
              <GearIcon />
            </IconButton>
            <IconButton
              label="Clear plan"
              onClick={clearPlan}
              disabled={plannedRecipes.length === 0}
            >
              <TrashIcon />
            </IconButton>
          </div>
        </div>

        {isMobile && (
          <div className="strip" role="group" aria-label="Jump to day">
            {week.map((day) => {
              const visible =
                day.index >= firstVisible && day.index < firstVisible + VISIBLE_DAYS;
              return (
                <button
                  key={day.index}
                  type="button"
                  className={`strip__day${visible ? " strip__day--visible" : ""}${day.index === firstVisible ? " strip__day--first" : ""}${day.index === firstVisible + VISIBLE_DAYS - 1 ? " strip__day--last" : ""}${day.isToday ? " strip__day--today" : ""}`}
                  onClick={() => goToDay(day.index)}
                  aria-current={visible ? "true" : undefined}
                >
                  <span className="strip__name" aria-hidden="true">
                    {day.short[0]}
                  </span>
                  <span className="strip__num" aria-hidden="true">
                    {day.num}
                  </span>
                  <span className="visually-hidden">
                    {day.long} {day.num}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div
          className="cal__wrap"
          data-rows={activeMeals.length}
        >
        <div className="cal__labels" aria-hidden="true">
          <span className="cal__corner">W{first.week}</span>
          {activeMeals.map((meal) => (
            <span
              key={meal.id}
              className={`cal__rowlabel cal__rowlabel--${meal.color}`}
              title={meal.label}
            >
              <span>
                <MealGlyph meal={meal} />
              </span>
            </span>
          ))}
        </div>
        <div
          className="cal"
          ref={scrollerRef}
          onScroll={onScroll}
        >
          {week.map((day) => (
            <section
              key={day.index}
              className={`daycol${day.isToday ? " daycol--today" : ""}`}
              aria-label={`${day.long} ${day.num}`}
            >
              <h2 className="daycol__head">
                <span className="daycol__name">{day.short}</span>
                <span className="daycol__num">{day.num}</span>
                {day.isToday && <span className="visually-hidden"> (today)</span>}
              </h2>
              {activeMeals.map((meal) => (
                <MealCell
                  key={meal.id}
                  day={day}
                  meal={meal}
                  recipes={slotOf(day.index, meal.id)}
                  selected={
                    target.dayIndex === day.index && target.mealId === meal.id
                  }
                  onSelect={() => select(day.index, meal.id)}
                />
              ))}
            </section>
          ))}
        </div>
        </div>
      </div>

      {showDrawer && (
        <RecipeDrawer
          target={target}
          onClose={isMobile ? () => setSheetOpen(false) : null}
        />
      )}

      {isMobile && !sheetOpen && (
        <button
          ref={fabRef}
          type="button"
          className="fab"
          aria-label="Add recipe"
          title="Add recipe"
          onClick={() => setSheetOpen(true)}
        >
          <PlusIcon />
        </button>
      )}

      {settingsOpen && <SettingsDialog onClose={() => setSettingsOpen(false)} />}
      {shareOpen && <ShareDialog onClose={() => setShareOpen(false)} />}
    </section>
  );
}

export default Planner;
