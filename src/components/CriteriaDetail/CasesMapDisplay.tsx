import React from "react";
import { DataDisplayProps } from "./CriteriaDetail";
import { CountyMap } from "components/Maps/CountyMap";
import { CountyData } from "types/report";
import { MapNode } from "./CLIMapDisplay";
const legend = [
  {
    className: "counties--cases-not-downward",
    legendKey: "Upward trend"
  },
  { className: "counties--cases-six-days", legendKey: "1-6 days" },
  { className: "counties--cases-thirteen-days", legendKey: "7-13 days" },
  { className: "counties--cases-twenty-days", legendKey: "14-20 days" },
  { className: "counties--cases-forty-one-days", legendKey: "21-41 days" },
  { className: "counties--cases-gt-forty-one-days", legendKey: ">= 42 days" },
  {
    className: "counties--cases-one-to-five",
    legendKey: "1-5 cases in the past two weeks"
  },
  {
    className: "counties--cases-zero",
    legendKey: "0 cases in the past two weeks"
  },
  { className: "counties--cases-none", legendKey: "No reported cases" }
];
const legendKey = {
  lte6: "counties--cases-six-days",
  lte13: "counties--cases-thirteen-days",
  lte20: "counties--cases-twenty-days",
  lte41: "counties--cases-forty-one-days",
  gt41: "counties--cases-gt-forty-one-days",
  inc: "counties--cases-not-downward",
  low2wk: "counties--cases-one-to-five",
  zero: "counties--cases-zero",
  na: "counties--cases-none"
};
export const MapCasesDisplay: React.FC<DataDisplayProps> = props => {
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
    if (!countyData || !countyData.confirmedCases) {
      acc[fips] = {
        fips,
        className: "counties--not-calculated",
        analysis: "No data"
      };
      return acc;
    }
    const { daysMet, analysis, date: dataDate } = countyData.confirmedCases;
    let className;
    let description;
    switch (true) {
      case daysMet === 0:
        className = legendKey["inc"];
        description = `County is seeing an increase in cases`;
        break;
      case daysMet <= 6:
        className = legendKey["lte6"];
        description = `County has been in decline for ${daysMet} days`;
        break;
      case daysMet <= 13:
        className = legendKey["lte13"];
        description = `County has been in decline for ${daysMet} days`;
        break;

      case daysMet <= 20:
        className = legendKey["lte20"];
        description = `County has been in decline for ${daysMet} days`;
        break;
      case daysMet <= 41:
        className = legendKey["lte41"];
        description = `County has been in decline for ${daysMet} days`;
        break;
      case daysMet > 41:
        className = legendKey["gt41"];
        description = `County has been in decline for ${daysMet} days`;
        break;
      default:
        className = legendKey["na"];
        description = `No information on county`;
    }
    const mapNode: MapNode = {
      fips,
      className,
      description,
      analysis,
      dataDate
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
        legendLabel={"Duration of downward trend in days"}
      ></CountyMap>
      <div className="c19-sr-criteria-graph-details">
        <h5 className="c19-sr-criteria-graph-details__title">
          About this graph
        </h5>
        <ul className="c19-sr-criteria-graph-details__list">
          <li>
            This map shows the trend of new documented cases of COVID-19 by
            county of residence. To establish a trend, it compares the current
            14 day period to the previous 14 day period.
          </li>
        </ul>
      </div>
    </>
  );
};
