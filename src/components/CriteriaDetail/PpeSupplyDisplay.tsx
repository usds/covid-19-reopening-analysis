import React from "react";
import { DataDisplayProps } from "./CriteriaDetail";
import { TextDisplay } from "./TextDisplay";
import { HospitalData } from "types/report";

export const PpeSupplyDisplay: React.FC<DataDisplayProps> = props => {
  // const ppe = ((props.data as any) as HospitalData[])[0];
  // ppe value is undefined or empty string if unknown
  // ppe value has "greater" if not low
  // const statusClass = ppe
  //   ? /greater/.test(ppe)
  //     ? "is-met"
  //     : "is-not-met"
  //   : "is-unknown";
  return null;
  // <TextDisplay
  //   statusText={`${ppe || "Status not available"}`}
  //   statusClass={statusClass}
  // >
  //   {props.children}
  // </TextDisplay>
};
