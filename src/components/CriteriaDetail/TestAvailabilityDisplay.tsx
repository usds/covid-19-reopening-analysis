import React from "react";
import { DataDisplayProps } from "./CriteriaDetail";
import { TextDisplay } from "./TextDisplay";
import { TestsData } from "types/report";

export const TestAvailabilityDisplay: React.FC<DataDisplayProps> = props => {
  const { data } = props;

  // Look at most recent 14 days, minus potentially incomplete
  //TODO: do we count the incompletes?
  const minPositiveBar = 15;
  const maxPositive = ((data as unknown) as TestsData[])
    .filter(e => !e.incomplete)
    .slice(-14)
    .reduce(
      (prev, day) =>
        day.incomplete
          ? prev
          : Math.max(prev, (day.positive / day.total) * 100),
      0
    );

  return (
    <>
      <TextDisplay
        statusText={
          maxPositive
            ? `${Math.round(maxPositive)}% maximum during this period`
            : "Data not available"
        }
        statusClass={
          maxPositive && maxPositive < minPositiveBar ? "is-met" : "is-not-met"
        }
      >
        {props.children}
      </TextDisplay>
      <div className="c19-sr-criteria-graph-details">
        <h5 className="c19-sr-criteria-graph-details__title">
          About this statistic
        </h5>
        <ul className="c19-sr-criteria-graph-details__list">
          <li>
            This statistic measures the highest positive test percentage during
            the previous 14 days which must be less than or equal to{" "}
            {minPositiveBar}%.
          </li>
          <li>
            As testing increases, it is not unusual or alarming for case counts
            to increase as long as both the percentage of positive results
            decreases and the number of tests being performed stays constant or
            increases.
          </li>
        </ul>
      </div>
    </>
  );
};
