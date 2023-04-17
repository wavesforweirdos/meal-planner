import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/style.css";

import SideBar from "./sections/sidebar";
import TopMenu from "./sections/TopMenu";
import Hero from "./sections/Hero";

import { RecipeContextProvider } from "./context/RecipeContext";
import Recipe from "./components/Recipe/Recipe";

import { CalendarContextProvider } from "./context/CalendarContext";
import Calendar from "./components/Calendar/Calendar";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from "./components/DragDrop";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SideBar />
    <TopMenu />
    <Hero />
    <DndProvider backend={HTML5Backend}>
      <RecipeContextProvider>
        <CalendarContextProvider>
          <div id="info-planer" className="calendar-container">
            <div className="calendar-title">
              <h1>Spoonacular Recipes</h1>
              <p>
                We use the Spoonacular's API to perform the recipe lookup. If
                you want to know more information about it, you just have to
                click on it.
              </p>
              <p>
                Select and drag the recipe that you prefer in the corresponding
                time slot
              </p>
              <img
                className="mt-5"
                src="https://cdn.onlinewebfonts.com/svg/img_525862.png"
                width="100px"
              />
            </div>
          </div>
          <div id="meal-planer" className="app-container orange py-5">
            <Calendar />
            <Recipe />
          </div>
        </CalendarContextProvider>
      </RecipeContextProvider>
    </DndProvider>
  </React.StrictMode>
);
