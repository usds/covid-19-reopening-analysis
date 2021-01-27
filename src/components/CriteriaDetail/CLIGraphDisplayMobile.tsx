import React from "react";
import { DataDisplayProps } from "./CriteriaDetail";

import { ScatterAndLineGraph } from "components/Graphs/ScatterAndLineGraph";
import { SplineData } from "types/report";

export const GraphCLIDisplay: React.FC<DataDisplayProps> = props => {
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
    dataPoint: "Reported COVID-like illnesses",
    smoothLine: "3-day rolling average"
  };
  const lineGraphRefArea = {
    xAreaStart: lastValidDate,
    refLabelY: caseLocalMax,
    label: "Not yet reported"
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
            During a visit to an emergency department for COVID-like illness, a
            patient's chief complaint is related to coronavirus or severe acute
            respiratory syndrome when they are admitted or discharged.
          </li>
        </ul>
      </div>
    </>
  );
};
