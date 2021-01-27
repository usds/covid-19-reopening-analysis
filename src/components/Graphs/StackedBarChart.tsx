import React from "react";
import {
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import {
  RefArea,
  renderNotReportedReference
} from "./graphUtils/notYetReported";

import { renderXAxis } from "./graphUtils/xAxis";
import { renderCustomTooltip } from "./graphUtils/toolTip";
import { renderCustomLegend } from "./graphUtils/legend";

export interface StackedBarChartProps {
  syncId?: string;
  data: { topBar: number; bottomBar: number; dataDate: number }[];
  labels: { topBar: string; bottomBar: string; refLine?: string };
  // legend?: { topBar: string, bottomBar: string };
  refArea?: RefArea;
  classNames: {
    bottomBar: string;
    topBar: string;
    refArea?: string;
    refLine?: string;
  };
  refLine?: number;
  tickFormat?: (t: string) => string;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = props => {
  const {
    data,
    tickFormat,
    syncId,
    refArea,
    labels,
    refLine,
    classNames
  } = props;

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
  // in case we want to toggle this...?
  const toolTipEl = (
    <Tooltip
      filterNull={false}
      content={renderCustomTooltip(
        (refArea && refArea.xAreaStart) || null,
        labels,
        classNames,
        tickFormat
      )}
    />
  );

  const refLineEl = refLine ? (
    <ReferenceLine
      y={refLine}
      label={labels.refLine}
      className={classNames.refLine}
      strokeDasharray="1 1"
      strokeWidth={2}
      position="start"
    />
  ) : null;

  return (
    <div className="c19-sr-criteria-graph-and-table-container">
      <div className="c19-sr-criteria-graph__container" aria-hidden="true">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            syncId={syncId}
            margin={{ top: 24, right: 0, left: 0, bottom: 0 }}
          >
            {renderXAxis(data[0].dataDate)}
            <YAxis tickFormatter={tickFormat} />
            {toolTipEl}
            {legendEl}
            {refAreaEl}
            <Bar
              name={labels.bottomBar}
              dataKey="bottomBar"
              stackId="a"
              className={classNames.bottomBar}
            />
            <Bar
              name={labels.topBar}
              dataKey="topBar"
              stackId="a"
              className={classNames.topBar}
            />
            {refLineEl}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
