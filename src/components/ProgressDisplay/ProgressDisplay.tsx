import React from "react";
import moment, { Moment } from "moment";
import { SplineData } from "types/report";

const name = "c19-sr-progress-display";

// const monthDay = (d: string | number | Moment) => moment(d).format("M/D");

interface Props {
  data: SplineData[];
  met: boolean;
  notMetExplanation: string;
  notMetTitle: string;
}

const ProgressDisplay: React.FC<Props> = props => {
  const { data, met, notMetExplanation, notMetTitle } = props;
  const days = data.slice(-33).map(e => {
    let status;
    if (e.incomplete) {
      return { date: e.date, status: "nodata" };
    }
    switch (e.status) {
      case "count":
        status = "met";
        break;
      case "growth":
        status = "reset";
        break;
      case "grace period":
        status = "missed";
        break;
      case "missing":
      default:
        status = "nodata";
        break;
    }
    return { date: e.date, status };
  });
  let daysMetArr = data.filter(e => !e.incomplete);
  let daysMet = daysMetArr[daysMetArr.length - 1].daysMet;

  let metStatusClass;
  if (met) {
    metStatusClass = "is-met";
  } else {
    metStatusClass = "is-not-met";
  }
  const summary = met ? "Criteria has been met" : "Criteria has not been met";

  const description = daysMet
    ? `${daysMet} consecutive day${daysMet === 1 ? "" : "s"} of decrease`
    : "";

  //TODO: Put back resetDate in the future
  //resetDate = null;

  return (
    <div className={`${name}`}>
      <div className={`${name}__data`}>
        <h4 className={`c19-sr-progress-display__summary ${metStatusClass}`}>
          {summary}
        </h4>
        <div className={`${name}__container`}>
          <div className={`${name}__days-container`}>
            <div className={`${name}__day-labels`}>
              <div className={`${name}-day-label--increase`}>Increase</div>
              <div className={`${name}-day-label--decrease`}>Decrease</div>
            </div>
            <div className={`${name}__days`} role="list">
              {days.map((day, i) => (
                <span
                  key={i}
                  role="listitem"
                  onMouseOver={e => console.log(e.target)}
                  aria-label={moment(day.date).format("MMMM D")}
                  title={moment(day.date).format("MMMM D")}
                  className={`${name}-day ${name}-day--${day.status}`}
                ></span>
              ))}
            </div>
          </div>
          <div className={`${name}__met-description`}>{description}</div>
        </div>
      </div>
      {notMetExplanation.length ? (
        <div className={`${name}__desc`}>
          <div className={`${name}-reset`}>
            <h6 className={`${name}-reset__title`}>{notMetTitle}</h6>
            <p className={`${name}-reset__desc`}>{notMetExplanation}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProgressDisplay;
