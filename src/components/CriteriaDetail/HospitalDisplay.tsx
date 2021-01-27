import React from "react";
import { DataDisplayProps } from "./CriteriaDetail";
import { StackedBarChart } from "components/Graphs/StackedBarChart";
import { HospitalData, SplineData } from "types/report";
import { ScatterAndLineGraph } from "components/Graphs/ScatterAndLineGraph";

export const HospitalDisplay: React.FC<DataDisplayProps> = props => {
  const { data, children } = props;
  const syncId = "hospitalGraphData";

  let firstInvalidDate = 0;
  const chartData = ((data as unknown) as HospitalData[]).map(e => {
    const {
      date: dataDate,
      incomplete,
      insuffienctPPEPercent,
      hospMissingPPE,
      staffShortagePercent,
      hospCount,
      icuOccupancyPercentage,
      c19InpatientBurdenPercentage,
      c19BurdenDeriv,
      c19BurdenSpline,
      daysMet,
      status
    } = e;

    if (!firstInvalidDate && e.incomplete) {
      firstInvalidDate = dataDate;
    }
    return {
      dataDate,
      incomplete,
      insuffienctPPEPercent,
      hospMissingPPE,
      staffShortagePercent,
      hospCount,
      icuOccupancyPercentage,
      c19InpatientBurdenPercentage,
      c19BurdenDeriv,
      c19BurdenSpline,
      daysMet,
      status
    };
  });

  let lastValidDate = 0;
  let graphData = ((data as unknown) as HospitalData[]).map((e): {
    dataDate: number;
    smoothLine: number | null;
    dataPoint: number | null;
  } => {
    if (e.incomplete) {
      return {
        dataDate: e.date,
        smoothLine: null,
        dataPoint: null
      };
    }
    lastValidDate = e.date;
    return {
      dataDate: e.date,
      smoothLine: !e.c19BurdenSpline
        ? e.c19BurdenSpline
        : +(e.c19BurdenSpline * 100).toFixed(3),
      dataPoint: !e.c19InpatientBurdenPercentage
        ? e.c19InpatientBurdenPercentage
        : +(e.c19InpatientBurdenPercentage * 100).toFixed(3)
    };
  });

  const scatterAndLineLabels = {
    dataPoint: "Percent of Inpatient Beds with Covid-19",
    smoothLine: "Trend line"
  };
  const lineGraphRefArea = {
    xAreaStart: lastValidDate,
    refLabelY: 100,
    label: "Data adjusting"
  };
  const classNames = {
    dataPoint: "c19-sr-graph-color__data-point",
    smoothLine: "c19-sr-graph-color__smooth-line"
  };

  const barChartRefArea = {
    xAreaStart: firstInvalidDate - 1000,
    refLabelY: 97,
    label: "Data adjusting"
  };

  const inpatientBurdenLabels = {
    topBar: "",
    bottomBar: "Inpatient Burden",
    refLine: "Maximum utilization"
  };

  const criticalCareLabels = {
    topBar: "",
    bottomBar: "Critical care beds in use",
    refLine: "Maximum utilization"
  };

  const inpatientCareLabels = {
    topBar: "",
    bottomBar: "Inpatient care beds in use",
    refLine: "Maximum utilization"
  };

  const barClasses = {
    bottomBar: "c19-sr-graph-color__data-hospital-bottom",
    topBar: "c19-sr-graph-color__data-hospital-top",
    refLine: "c19-sr-graph-color__data-"
  };

  const inpatientRefLine = 80.0;
  const criticalCareRefLine = 75.0;
  const inpatientBedsRefLine = 75.0;

  return (
    <>
      <h4>Covid 19 Inpatient Burden</h4>
      <ScatterAndLineGraph
        data={graphData}
        classNames={classNames}
        labels={scatterAndLineLabels}
        refArea={lineGraphRefArea}
        tickFormat={(t: string) => t + "%"}
      />
      {children}
      <div className="c19-sr-criteria-graph-details">
        <h5 className="c19-sr-criteria-graph-details__title">
          About this graph
        </h5>
        <ul className="c19-sr-criteria-graph-details__list"></ul>
      </div>
      <h4>Inpatient Burden</h4>
      <StackedBarChart
        syncId={syncId}
        data={chartData.map(e => {
          const { dataDate, icuOccupancyPercentage } = e;
          console.log(icuOccupancyPercentage);
          let adjusted = icuOccupancyPercentage
            ? +(icuOccupancyPercentage * 100).toFixed(1)
            : 0;
          if (adjusted === 0) {
            return {
              dataDate,
              topBar: 0,
              bottomBar: 0
            };
          }
          return {
            dataDate,
            topBar: 100 - adjusted,
            bottomBar: adjusted
          };
        })}
        classNames={barClasses}
        refArea={barChartRefArea}
        labels={inpatientBurdenLabels}
        refLine={inpatientRefLine}
        tickFormat={(t: string) => t + "%"}
      ></StackedBarChart>
      {/*
      <h4>Critical care</h4>
      <StackedBarChart
        syncId={syncId}
        data={chartData.map(e => {
          const { dataDate, criticalCareAvail, criticalCareCapacity } = e;
          if (criticalCareCapacity === 0) {
            return {
              dataDate,
              topBar: 0,
              bottomBar: 0
            };
          }
          const percentInUse = Math.round(
            ((criticalCareCapacity - criticalCareAvail) /
              criticalCareCapacity) *
              100
          );
          return {
            dataDate,
            topBar: 100 - percentInUse,
            bottomBar: percentInUse
          };
        })}
        classNames={barClasses}
        refArea={barChartRefArea}
        labels={criticalCareLabels}
        refLine={criticalCareRefLine}
        tickFormat={(t: string) => t + "%"}
      ></StackedBarChart>

      <h4>Inpatient beds</h4>
      <StackedBarChart
        syncId={syncId}
        data={chartData.map(e => {
          const { dataDate, inpatientCareAvail, inpatientCareCap } = e;
          if (inpatientCareCap === 0) {
            return {
              dataDate,
              topBar: 0,
              bottomBar: 0
            };
          }
          const percentInUse = Math.round(
            ((inpatientCareCap - inpatientCareAvail) / inpatientCareCap) * 100
          );
          return {
            dataDate,
            topBar: 100 - percentInUse,
            bottomBar: percentInUse
          };
        })}
        classNames={barClasses}
        refArea={barChartRefArea}
        labels={inpatientCareLabels}
        refLine={inpatientBedsRefLine}
        tickFormat={(t: string) => t + "%"}
      />
      {props.children}
      <div className="c19-sr-criteria-graph-details">
        <h5 className="c19-sr-criteria-graph-details__title">
          About these graphs
        </h5>
        <ul className="c19-sr-criteria-graph-details__list">
          <li>
            An available bed is a bed that a hospital can put a person in should
            they need care.
          </li>
          <li>
            This criteria is not required to be maintained for 14 consecutive
            days.
          </li>
        </ul>
      </div> */}
    </>
  );
};
