import React from "react";
import { DataDisplayProps } from "./CriteriaDetail";
import { TextDisplay } from "./TextDisplay";
import { HospitalData } from "types/report";

export const StaffDisplay: React.FC<DataDisplayProps> = props => {
  // const short = ((props.data as any) as HospitalData).staffShortage;
  // const text = short ? "Staff shortages" : "No staff shortages";
  return null;
  // <TextDisplay
  //   statusText={text}
  //   statusClass={short ? "is-not-met" : "is-met"}
  // >
  //   {props.children}
  // </TextDisplay>
};
