import React from "react";

import CriteriaDetailEl from "components/CriteriaDetail/CriteriaDetail";
import { CriteriaDetail, CovidStats } from "types/report";
import { simpleData, syndromicData } from "./storyData/GA";

import gaData from "./storyData/13000.json";
import gaStateWide from "./storyData/currentStatus.json";

export default {
  title: "Criteria Details",
  component: CriteriaDetailEl
};

const c19Syndromic = syndromicData.map(e => {
  return {
    dataDate: e["Date"],
    dataPoint: +e["COVID-19"]
    // dataDate: '5/3/20', dataPoint: 0
  };
});

const criteria: CriteriaDetail = {
  criteriaName: "Criteria Title",
  criteriaDetails: "Criteria details",
  met: true,
  daysMet: [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true
  ],
  dataSource: "cli",
  dataViews: [
    {
      type: "graphILI"
    }
  ]
  // updatedAt:
};
export const GraphILIExample = () => (
  <CriteriaDetailEl
    criteria={criteria}
    criteriaNumber={1}
    stateName={"Georgia"}
    covidStats={(gaData as unknown) as CovidStats}
    updateFips={(fips: string) => {}}
  />
);

export const GraphILITitle = () => (
  <CriteriaDetailEl
    criteria={{ ...criteria, criteriaName: "Title override" }}
    criteriaNumber={1}
    covidStats={(gaData as unknown) as CovidStats}
    stateName={"Georgia"}
    updateFips={(fips: string) => {}}
  />
);
