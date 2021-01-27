import React from "react";
import classnames from "classnames";
/* https://designsystem.digital.gov/components/table/ */

interface Props {
  className?: string;
  caption?: string;
  fields: {
    key: string;
    title?: string;
    format?: (datum: any, index: number) => string;
  }[];
  data: { [key: string]: any }[];
}

export const cellFormat = (v: any) => {
  if (v === undefined || v === null) {
    return "";
  }
  if (typeof v === "number") {
    if (!isFinite(v)) {
      return "";
    }
    const exp = Math.log10(Math.abs(v));
    if (exp < -3 || exp >= 7) {
      return v.toExponential(2);
    }
    if (exp >= 2 || v === Math.floor(v)) {
      return Math.round(v);
    }
    return v.toFixed(2 - Math.floor(exp));
  }
  return String(v);
};

const DataTable: React.FC<Props> = props => {
  const { caption, fields, data, className } = props;
  return (
    <table className={classnames("usa-table usa-prose", className)}>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>{fields.map((f, i) => f.title && <th key={i}>{f.title}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row, rn) => (
          <tr key={rn}>
            {fields.map(
              (f, cn) =>
                f.title && (
                  <td key={cn}>{(f.format || cellFormat)(row[f.key], rn)}</td>
                )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
