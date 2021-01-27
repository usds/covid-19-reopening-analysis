import React, { useEffect, useState } from "react";
import { getCovidStats } from "api";
import { ReportDetails } from "types/report";

interface Props {
  fips: string;
  setReportData: (data: ReportDetails) => void;
}

export const ApiContainer: React.FC<Props> = props => {
  const { fips, setReportData } = props;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getCovidStats(fips);
      setReportData(data);
      setIsLoading(false);
    })();
  }, [fips, setReportData]);

  return isLoading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >
      <h3>Loading...</h3>
    </div>
  ) : (
    <>{props.children}</>
  );
};
