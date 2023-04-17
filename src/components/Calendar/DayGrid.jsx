import MealContainer from "../Meals/MealContainer";

function DayGrid({ num, day }) {
  const className = "day " + day.toLowerCase();
  return (
    <div className={className}>
      <div className="date">
        <p className="date-num">{num}</p>
        <p className="date-day">{day}</p>
      </div>
      <div className="events">
        <MealContainer type="breakfast" placeholder="Breakfast" />
        <MealContainer type="lunch" placeholder="Lunch" />
        <MealContainer type="dinner" placeholder="Dinner" />
        <MealContainer type="afterWork" placeholder="AfterWork" />
        <MealContainer type="snack" placeholder="Snack" />
      </div>
    </div>
  );
}

export default DayGrid;
