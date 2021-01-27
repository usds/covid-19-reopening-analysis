import React from "react";
import { Dot } from "recharts";

const SIZE = 32;
export const renderCustomLegend = (classNames: any) => (props: any) => {
  const { payload } = props;
  const legendItems = payload.map((e: any, i: number) => {
    if (e.dataKey === e.value) {
      return null;
    }
    let shape = null;
    switch (e.type) {
      case "line":
        shape = (
          <line
            strokeWidth={4}
            // stroke={color}
            // strokeDasharray={data.payload.strokeDasharray}
            x1={0}
            y1={SIZE / 2}
            x2={SIZE}
            y2={SIZE / 2}
            className="recharts-legend-icon"
          />
        );
        break;
      case "circle":
        shape = <Dot cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 4} />;
      // eslint-disable-next-line no-fallthrough
      default:
        shape = (
          <path
            // fill={color}
            d={`M0,${SIZE / 8}h${SIZE}v${(SIZE * 3) / 4}h${-SIZE}z`}
            className="recharts-legend-icon"
          />
        );
        break;
    }
    return (
      <li
        key={i}
        className={`recharts-legend-item legend-item-${i} ${
          classNames[e.dataKey]
        }`}
        style={{ display: "inline-block", marginRight: "10px" }}
      >
        <svg
          className="recharts-surface"
          width="14"
          height="14"
          viewBox="0 0 32 32"
          version="1.1"
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginRight: "4px"
          }}
        >
          {shape}
          {/* <path
      className="recharts-symbols"
      transform="translate(16, 16)"
      d="M16,0A16,16,0,1,1,-16,0A16,16,0,1,1,16,0"
    ></path> */}
        </svg>
        <span className="recharts-legend-item-text">{e.value}</span>
      </li>
    );
  });
  // const testFoo = payload
  //   .map((e: { value: string; dataKey: string }) => {
  //     const { value, dataKey } = e;
  //     const styles: { color?: string } = {};
  //     if (colorScheme && typeof colorScheme[dataKey] != "undefined") {
  //       styles.color = colorScheme[dataKey];
  //     }
  //     if (!labels) {
  //       return null;
  //     }
  //     if (typeof labels[dataKey] === "undefined") {
  //       return null;
  //     }
  //     if (typeof labels[dataKey] === "function") {
  //       // Escape hatch...
  //       return (labels[dataKey] as (v: string) => any)(value);
  //     }

  //     return <div>{labels[dataKey]}</div>;
  //   })
  //   .filter((e: any) => e);
  return (
    <ul
      className="recharts-default-legend"
      style={{ padding: "0px", margin: "0px", textAlign: "left" }}
    >
      {legendItems}
      {/* <li
          class="recharts-legend-item legend-item-1"
          style="display: inline-block; margin-right: 10px;"
        >
          <svg
            class="recharts-surface"
            width="14"
            height="14"
            viewBox="0 0 32 32"
            version="1.1"
            style="display: inline-block; vertical-align: middle; margin-right: 4px;"
          >
            <path
              stroke-width="4"
              fill="none"
              stroke="#3182bd"
              d="M0,16h10.666666666666666
            A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
            H32M21.333333333333332,16
            A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"
              class="recharts-legend-icon"
            ></path>
          </svg>
          <span class="recharts-legend-item-text">3-day rolling average</span>
        </li>  */}
    </ul>
  );
};
