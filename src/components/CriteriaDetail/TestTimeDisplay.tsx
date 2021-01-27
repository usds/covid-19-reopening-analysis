import React from "react";
import { DataDisplayProps } from "./CriteriaDetail";
import { TextDisplay } from "./TextDisplay";
import { TestsData } from "types/report";

export const TestTimeDisplay: React.FC<DataDisplayProps> = props => {
  const data = (props.data as any) as TestsData;
  const days = data.medianTimeToTest;

  // TODO: from the CDC document:
  // Test availability such that percentage of positive tests is ≤20% for 14 days
  // Median time from test order to result is ≤N days"
  // N=4 for phase 1, but N=3 for phase 2 and N=2 for phase 3
  const medianDaysGoal = 4;
  const daysStatus = days
    ? days <= medianDaysGoal
      ? "is-met"
      : "is-not-met"
    : "is-unknown";

  return (
    <TextDisplay
      statusText={`${days ? days + " days" : "Status not available"}`}
      statusClass={daysStatus}
    >
      {props.children}
    </TextDisplay>
  );
};
