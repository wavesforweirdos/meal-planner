import { createContext, useState, useEffect } from "react";

export const CalendarContext = createContext();

export function CalendarContextProvider(props) {
  const [calendar, setCalendar] = useState([]);
  useEffect(() => {
    function getCalendar() {
      const curr = new Date();
      const week = [];

      for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i;
        let day = new Date(curr.setDate(first));
        let numberDay = Number(day.getDate());
        let nameDay = String(day.toString().split(" ")[0]);

        week.push({ numberDay: numberDay, nameDay: nameDay });
      }
      return week;
    }
    const week = getCalendar();
    setCalendar(week);
  }, []);

  return (
    <CalendarContext.Provider value={{ calendar }}>
      {props.children}
    </CalendarContext.Provider>
  );
}
