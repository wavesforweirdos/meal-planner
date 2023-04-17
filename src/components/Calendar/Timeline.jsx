function CalulatestartHoursFromInterval(start, end, interval) {
  const timeArray = [],
    startDummyDate = new Date(Date.parse("01/01/2023 " + start)),
    endDummyDate = new Date(Date.parse("01/01/2023 " + end)),
    startH = startDummyDate.getHours(),
    startM = startDummyDate.getMinutes(),
    endH = endDummyDate.getHours(),
    endM = endDummyDate.getMinutes(),
    metric = "H";

  for (var i = startH; i <= endH; ++i) {
    for (var j = i == startH ? Math.ceil(startM / interval) : 0; j < 2; ++j) {
      if (interval == 60 && j * interval != 60) {
        timeArray.push((i % 24) + ":" + (j * interval || "00") + " " + metric);
      }
      if (i == endH && j == endM) {
        return timeArray;
      }
    }
  }

  return timeArray;
}

function Timeline(props) {
  const startstartHour = props.startstartHour;
  const endstartHour = props.endstartHour;
  const interval = props.interval;

  const timeArray = CalulatestartHoursFromInterval(
    startstartHour,
    endstartHour,
    interval
  );

  return (
    <div className="timeline">
      <div className="spacer"></div>
      {timeArray.map((time, index) => {
        return (
          <div className="time-maker" key={"time" + index}>
            {time}
          </div>
        );
      })}
    </div>
  );
}

export default Timeline;
