import React from "react";
import { DataDisplayProps } from "./CriteriaDetail";
import { SplineData } from "types/report";
import { ScatterAndLineGraph } from "components/Graphs/ScatterAndLineGraph";

export const GraphCasesDisplay: React.FC<DataDisplayProps> = props => {
  const { data, children } = props;

  let caseLocalMax = 0;
  let lastValidDate = 0;
  let graphData = ((data as unknown) as SplineData[]).map(e => {
    if (e.incomplete) {
      return {
        dataDate: e.date,
        smoothLine: null,
        dataPoint: null
      };
    }
    if (e.count > caseLocalMax) {
      caseLocalMax = e.count;
    }
    lastValidDate = e.date;

    return {
      dataDate: e.date,
      smoothLine: Math.round(e.spline),
      dataPoint: e.count
    };
  });
  const scatterAndLineLabels = {
    dataPoint: "Newly identified COVID-19 cases",
    smoothLine: "3-day rolling average"
  };
  const lineGraphRefArea = {
    xAreaStart: lastValidDate,
    refLabelY: caseLocalMax,
    label: "Data adjusting"
  };
  const classNames = {
    dataPoint: "c19-sr-graph-color__data-point",
    smoothLine: "c19-sr-graph-color__smooth-line"
  };
  return (
    <>
      <ScatterAndLineGraph
        data={graphData}
        classNames={classNames}
        labels={scatterAndLineLabels}
        refArea={lineGraphRefArea}
      />
      {children}
      <div className="c19-sr-criteria-graph-details">
        <h5 className="c19-sr-criteria-graph-details__title">
          About this graph
        </h5>
        <ul className="c19-sr-criteria-graph-details__list">
          <li>
            Because the 3A and 3B criteria are closely related, only one is
            required to be met, not both.
          </li>
          <li>
            As testing increases, it is not unusual or alarming for case counts
            to increase as long as both the percentage of positive results
            decreases and the number of tests being performed stays constant or
            increases.
          </li>

          <li>
            Spikes in cases may be due to a delay in lab processing time and
            other electronic disease reporting complications. Also, dips usually
            occur on weekends when labs are not processing test results.
          </li>
        </ul>
      </div>
    </>
  );
};
