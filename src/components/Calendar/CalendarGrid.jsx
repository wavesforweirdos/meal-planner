import Timeline from "./Timeline";
import { CalendarContext } from "../../context/CalendarContext";
import { useContext } from "react";

import DayGrid from "./DayGrid";

function CalendarGrid() {
  const startstartHour = "08:00:00";
  const endstartHour = "20:00:00";
  const interval = 60;

  const { calendar } = useContext(CalendarContext);

  if (calendar != null) {
    return (
      <>
        {/* Está la opción de añadir un grid con las horas junto al Meal Planer */}
        {/* <Timeline
          className="timeline"
          startstartHour={startstartHour}
          endstartHour={endstartHour}
          interval={interval}
        /> */}
        <div className="days">
          {calendar &&
            calendar.map((day, index) => {
              return (
                <DayGrid
                  num={day.numberDay}
                  day={day.nameDay}
                  key={"day" + index}
                />
              );
            })}
        </div>
      </>
    );
  }
}

export default CalendarGrid;
