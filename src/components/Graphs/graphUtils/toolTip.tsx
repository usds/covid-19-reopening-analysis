import React from "react";
import moment from "moment";
type xRefAreaStart = number | null;
type toolTipLabels = {
  [key: string]: string | ((v: string) => any) | undefined;
};
type classNames = { [key: string]: string | undefined };
export const renderCustomTooltip = (
  xRefAreaStart: xRefAreaStart,
  labels?: toolTipLabels,
  classNames?: classNames,
  tickFormat?: (t: string) => string
) => (props: any) => {
  const { active } = props;
  if (!props.payload) {
    return null;
  }
  if (active) {
    const { payload, label: dateValue } = props;
    const fmtdDate = moment(dateValue).format("MM/DD/YYYY");
    if (xRefAreaStart && dateValue > xRefAreaStart) {
      return (
        <table className="c19-sr-graph-custom-tooltip c19-sr-graph-custom-tooltip__data-adjusting">
          <thead>
            <tr>
              <th className="cell-date">{fmtdDate}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="cell-label">Data is still being collected</td>
            </tr>
          </tbody>
        </table>
      );
    }

    const dataElements = payload
      .map((e: { value: string; dataKey: string }) => {
        const { value, dataKey } = e;
        if (!labels) {
          return null;
        }

        if (labels[dataKey] === "" || typeof labels[dataKey] === "undefined") {
          return null;
        }
        if (typeof labels[dataKey] === "function") {
          // Escape hatch...
          return (labels[dataKey] as (v: string) => any)(value);
        }

        return (
          <tr
            key={dataKey}
            className={
              classNames && typeof classNames[dataKey] === "string"
                ? classNames[dataKey]
                : ""
            }
          >
            <td className="cell-label">{labels[dataKey]}</td>
            <td className="cell-value">
              {tickFormat
                ? tickFormat(value)
                : typeof value === "undefined" || value === null
                ? "Missing"
                : value.toLocaleString()}
            </td>
          </tr>
        );
      })
      .filter((e: any) => e);
    return (
      <table className="c19-sr-graph-custom-tooltip">
        <thead>
          <tr>
            <th className="cell-date" colSpan={2}>
              {fmtdDate}
            </th>
          </tr>
        </thead>
        <tbody>{dataElements}</tbody>
      </table>
    );
  }

  return null;
};
