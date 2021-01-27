import React from "react";
import { DataDisplayProps } from "./CriteriaDetail";
import { CountyMap } from "components/Maps/CountyMap";
import { CountyData } from "types/report";

export interface MapNode {
  fips: string;
  className: string;
  analysis: string;
  dataDate?: number;
  description?: string;
}

const legend = [
  { className: "counties--increasing", legendKey: "Increasing" },
  { className: "counties--plateau", legendKey: "Plateau" },
  { className: "counties--decreasing", legendKey: "Decreasing" },
  { className: "counties--not-calculated", legendKey: "No data" }
];
const legendKey = {
  growth: "counties--increasing",
  plateau: "counties--plateau",
  decline: "counties--decreasing",
  noData: "counties--not-calculated"
};

export const MapCLIDisplay: React.FC<DataDisplayProps> = props => {
  const { data, updateFips } = props;
  if (!data || !Object.keys(data).length) {
    return null;
  }

  const mapData = Object.keys(
    (data as unknown) as {
      [key: string]: CountyData;
    }
  ).reduce((acc, fips) => {
    const countyData = ((data as unknown) as {
      [key: string]: CountyData;
    })[fips];
    if (!countyData || !countyData.cli) {
      acc[fips] = {
        fips,
        className: "counties--not-calculated",
        analysis: "No data"
      };
      return acc;
    }
    let className;
    let description;
    switch (countyData.cli.analysis) {
      case "growth":
        className = legendKey["growth"];
        description = "CLI cases are growing";
        break;
      case "plateau":
        className = legendKey["plateau"];
        description = "CLI cases have plateaued";
        break;
      case "decline":
        className = legendKey["decline"];
        description = "CLI cases are declining";
        break;
      default:
        className = legendKey["noData"];
        description = "There is not currently available data for this county";
        break;
    }
    const mapNode: MapNode = {
      fips,
      className,
      description,
      analysis: countyData.cli.analysis,
      dataDate: countyData.cli.date
    };
    acc[fips] = mapNode;

    return acc;
  }, {} as { [key: string]: MapNode });

  return (
    <>
      <CountyMap
        counties={mapData}
        legend={legend}
        onClick={updateFips}
      ></CountyMap>
      <div className="c19-sr-criteria-graph-details">
        <h5 className="c19-sr-criteria-graph-details__title">
          About this graph
        </h5>
        <ul className="c19-sr-criteria-graph-details__list">
          <li>
            This map shows the downward or upward trend of COVID-like illnesses
            by county of residence. To establish a trend, it compares the
            current 14 day period to the previous 14 day period.
          </li>
        </ul>
      </div>
    </>
  );
};
