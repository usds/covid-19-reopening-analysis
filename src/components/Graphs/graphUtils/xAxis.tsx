import React from "react";
import moment from "moment";
import { XAxis } from "recharts";

const renderMonthTick = (firstDay: number) => {
  return (tickProps: any) => {
    const { x, y, payload } = tickProps;
    const currentDate = moment(payload.value);
    const day = currentDate.date();

    if (
      day === 1 ||
      (payload.value === firstDay && moment(firstDay).date() < 26)
    ) {
      return (
        <>
        <text x={x+5} y={y} textAnchor="left" className="c19-sr-xaxis-label">
          {currentDate.format(" MMM ")}
        </text>
        </>
      );
    }
    return null;
  };
};

export function renderXAxis(firstDate: number, label?: string) {
  return [
    <XAxis
      key={`${firstDate}${label}time`}
      padding={{ left: 12, right: 0 }}
      dataKey="dataDate"
      type="number"
      tickFormatter={e => ""}
      domain={["dataMin", "dataMax"]}
      interval={6}
      tickLine={true}
      scale="time"
      height={5}
    />,
    <XAxis
      padding={{ left: 12, right: 0 }}
      key={`${firstDate}${label}day`}
      dataKey="dataDate"
      type="number"
      tickFormatter={e => moment(e).format("D")}
      domain={["dataMin", "dataMax"]}
      interval={13}
      tickLine={false}
      scale="time"
      axisLine={false}
      xAxisId="day"
      height={25}
    />,
    <XAxis
      key={`${firstDate}${label}month`}
      padding={{ left: 12, right: 0 }}
      tickLine={false}
      dataKey="dataDate"
      type="number"
      tick={renderMonthTick(firstDate)}
      domain={["dataMin", "dataMax"]}
      axisLine={false}
      interval={0}
      scale="time"
      xAxisId="month"
    />
  ];
}
