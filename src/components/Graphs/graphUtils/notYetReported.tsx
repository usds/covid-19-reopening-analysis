import React from "react";
import { ReferenceArea, ReferenceLine, ReferenceDot, Label } from "recharts";
export interface RefArea {
  xAreaStart: number;
  refLabelY?: number;
  label?: string;
}
export function renderNotReportedReference(refArea: RefArea, key?: string) {
  const { xAreaStart, refLabelY, label } = refArea;
  let labelEl = null;
  if (refLabelY && label) {
    labelEl = (
      <ReferenceDot
        key={1}
        x={xAreaStart}
        y={refLabelY}
        r={0}
        label={
          <Label
            position="top"
            angle={0}
            offset={15}
            className="c19-sr-not-yet-reported"
          >
            Data adjusting
          </Label>
        }
      />
    );
  }
  return [
    <ReferenceArea
      x1={xAreaStart}
      key={2}
      xAxisId="month"
      ifOverflow="extendDomain"
      fill="#F0F0F0"
      opacity={1}
      className="c19-sr-not-yet-reported"
    />,
    <ReferenceLine
      x={xAreaStart}
      key={3}
      xAxisId="month"
      strokeDasharray="1 1"
      stroke="#565C65"
      strokeWidth={2}
    />,
    labelEl
  ];
}
