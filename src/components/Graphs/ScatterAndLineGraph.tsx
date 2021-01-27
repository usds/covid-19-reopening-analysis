import React from "react";
import moment from "moment";

import {
  ComposedChart,
  Line,
  YAxis,
  Scatter,
  ResponsiveContainer,
  Dot,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

import { renderXAxis } from "./graphUtils/xAxis";
import {
  RefArea,
  renderNotReportedReference
} from "./graphUtils/notYetReported";
import { renderCustomTooltip } from "./graphUtils/toolTip";
import { renderCustomLegend } from "./graphUtils/legend";
import DataTable from "components/DataTable/DataTable";

export interface ScatterAndLineGraphProps {
  data: {
    dataDate: number; // date String
    dataPoint?: number | null;
    smoothLine?: number | null;
    trendLine?: number | null;
    smoothLineLabelPoint?: number | null;
    smoothLineLabelContent?: string;
    dataPointLabelPoint?: number | null;
    dataPointLabelContent?: string;
  }[];
  classNames: {
    dataPoint?: string;
    smoothLine?: string;
    trendLine?: string;
    refArea?: string;
  };
  labels: {
    dataPoint?: string;
    smoothLine?: string;
    trendLine?: string;
  };
  tickFormat?: (t: string) => string;
  yAxisMax?: number;
  syncId?: string;
  refArea?: RefArea;
}

export const ScatterAndLineGraph: React.FC<ScatterAndLineGraphProps> = props => {
  const {
    data,
    tickFormat,
    classNames,
    syncId,
    refArea,
    labels,
    yAxisMax
  } = props;
  let localData = data.slice();

  let refAreaEl = null;
  if (refArea) {
    refAreaEl = renderNotReportedReference(refArea);
  }
  let legendEl = (
    <Legend
      height={80}
      verticalAlign="top"
      align="left"
      content={renderCustomLegend(classNames)}
    />
  );
  const toolTipEl = (
    <Tooltip
      filterNull={false}
      content={renderCustomTooltip(
        (refArea && refArea.xAreaStart) || null,
        labels,
        classNames,
        tickFormat
      )}
      cursor={{ strokeDasharray: "6 3" }}
    />
  );

  if (labels.smoothLine) {
    localData.push({
      dataDate: localData[localData.length - 1].dataDate,
      smoothLineLabelPoint: localData[localData.length - 2].smoothLine,
      smoothLineLabelContent: labels.smoothLine
    });
  }
  return (
    <div className="c19-sr-criteria-graph-and-table-container">
      <div className="c19-sr-criteria-graph__container" aria-hidden="true">
        <ResponsiveContainer aria-hidden="true" width="100%" height={300}>
          <ComposedChart
            data={localData}
            syncId={syncId}
            margin={{
              top: 20,
              right: 0,
              left: 0,
              bottom: 0
            }}
          >
            {renderXAxis(data[0].dataDate)}
            <YAxis
              tickFormatter={tickFormat}
              tickLine={false}
              domain={[0, yAxisMax || "auto"]}
              axisLine={false}
              // label={{ value: yAxisLabel, angle: -90, position: 'insideBottomLeft' }}
            />
            <CartesianGrid vertical={false} />

            {toolTipEl}
            {legendEl}
            {refAreaEl}
            {/*scatterLabels*/}
            {/* Actual data */}
            <Scatter
              name={labels.dataPoint}
              dataKey="dataPoint"
              strokeWidth={0}
              shape={e => {
                const { cx, cy } = e;
                return (
                  <Dot
                    className={classNames.dataPoint}
                    cx={cx}
                    cy={cy}
                    r={3}
                  ></Dot>
                );
              }}
            />
            <Line
              name={labels.smoothLine}
              dataKey="smoothLine"
              dot={false}
              className={classNames.smoothLine}
              strokeWidth={3}
              activeDot={true}
            />
            {/* <Line
            name={labels.trendLine}
            dataKey="trendLine"
            stroke={colorScheme.trendLine}
            dot={false}
          />*/}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <DataTable
        className="usa-sr-only"
        fields={[
          {
            key: "dataDate",
            title: "Date",
            format: (date?: number) =>
              date ? moment(date).format("MMMM D") : ""
          },
          {
            key: "dataPoint",
            title: labels.dataPoint
          },
          {
            key: "smoothLine",
            title: labels.smoothLine
          },
          {
            key: "trendLine",
            title: labels.trendLine
          }
        ]}
        data={data}
      />
    </div>
  );
};
