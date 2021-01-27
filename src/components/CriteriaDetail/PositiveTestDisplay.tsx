import React from "react";
import { DataDisplayProps } from "./CriteriaDetail";
import { TestsData } from "types/report";
import { TextDisplay } from "./TextDisplay";

export const PositiveTestDisplay: React.FC<DataDisplayProps> = props => {
  const pct = ((props.data as any) as TestsData).positive || "(unknown)";

  return (
    <TextDisplay
      statusText={`Positive test rate: ${pct} percent`}
      statusClass={+pct && pct < 16 ? "is-met" : "is-not-met"}
    >
      {props.children}
    </TextDisplay>
  );
};
