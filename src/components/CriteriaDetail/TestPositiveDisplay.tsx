import React from "react";
import { DataDisplayProps } from "./CriteriaDetail";
import { StackedBarChart } from "components/Graphs/StackedBarChart";
import { ScatterAndLineGraph } from "components/Graphs/ScatterAndLineGraph";
export const TestPositiveDisplay: React.FC<DataDisplayProps> = props => {
  const { data } = props;
  console.log(data);
  const syncId = "StackedBarCharttemp";

  // Remove most recent 3 days, include the last 5 weeks
  let caseLocalMax = 0;
  let positiveTestsMax = 0;
  let lastValidDate = 0;
  let firstInvalidDate = 0;
  if (!Array.isArray(data)) {
    return null;
  }
  const chartData = (data as any[]).map(e => {
    if (e.total > caseLocalMax) {
      caseLocalMax = e.total;
    }
    if (e.incomplete) {
      if (!firstInvalidDate) {
        firstInvalidDate = e.date;
      }
    } else {
      lastValidDate = e.date;
    }
    const percentPositive = +(e.percentPositive * 100).toFixed(2);
    const percentPositiveSpline = +(e.percentPositiveSpline * 100).toFixed(2);
    if (percentPositive > positiveTestsMax) {
      positiveTestsMax = percentPositive;
    }

    return {
      dataDate: e.date,
      topBar: e.total - e.positive,
      bottomBar: e.positive,
      smoothLine: percentPositiveSpline,
      dataPoint: percentPositive,
      incomplete: e.positivityIncomplete
    };
  });
  const graphData = chartData.map(e => {
    if (e.incomplete) {
      return {
        dataDate: e.dataDate,
        smoothLine: null,
        dataPoint: null
      };
    }
    return e;
  });

  const barChartRefArea = {
    xAreaStart: (lastValidDate + firstInvalidDate) / 2,
    refLabelY: caseLocalMax,
    label: "Data adjusting"
  };

  const lineGraphRefArea = {
    xAreaStart: lastValidDate,
    refLabelY: positiveTestsMax,
    label: "Data adjusting"
  };
  const barLabels = {
    topBar: "Negative tests",
    bottomBar: "Positive tests"
  };
  const barClasses = {
    bottomBar: "c19-sr-graph-color__data-positive-test-bar",
    topBar: "c19-sr-graph-color__data-negative-test-bar"
  };

  const scatterAndLineLabels = {
    smoothLine: "Percent of total tests positive"
  };
  const classNames = {
    dataPoint: "c19-sr-graph-color__data-point",
    smoothLine: "c19-sr-graph-color__smooth-line"
  };
  return (
    <>
      <ScatterAndLineGraph
        data={graphData as { dataDate: number; smoothLine?: number }[]}
        classNames={classNames}
        tickFormat={(t: string) => t + "%"}
        labels={scatterAndLineLabels}
        syncId={syncId}
        refArea={lineGraphRefArea}
      />
      <h5 className="c19-sr-criteria-graph__title">Daily test counts</h5>
      <StackedBarChart
        syncId={syncId}
        data={chartData}
        classNames={barClasses}
        refArea={barChartRefArea}
        labels={barLabels}
      />
      {props.children}
      <div className="c19-sr-criteria-graph-details">
        <h5 className="c19-sr-criteria-graph-details__title">
          About these graphs
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
            Test volume must remain the same or be increasing for this criteria
            to be met.
          </li>
        </ul>
      </div>
    </>
  );
};
