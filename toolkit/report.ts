import fs from "fs";
import path from "path";

import { caseEpiAnalysis } from "./caseTrajectoryAnalysis";
import { iliEpiAnalysis } from "./iliTrajectoryAnalysis";
import { cliEpiAnalysis } from "./cliTrajectoryAnalysis";
import { testEpiAnalysis } from "./testTrajectoryAnalysis";

import { hospitalAnalysis } from "./hospitalAnalysis";
import { robustTestAnalysis } from "./robustTestsAnalysis";

import {
  CovidStats,
  RawCaseData,
  RawSyndromicData,
  RawTestData,
  RawHospData
} from "./analysis";

import {
  confirmedCasesDataSetValues,
  iliDataSetValues,
  cliDataSetValues,
  hospitalDataSetValues,
  positivityDataSetValues
} from "../src/types/report";

function createReport(
  dataSources,
  fips,
  casesData: RawCaseData[],
  cliData: RawSyndromicData[],
  iliData: RawSyndromicData[],
  hosp: RawHospData[],
  testsData: RawTestData[],
  phase,
  adjustingPeriod = 3
): CovidStats {
  const confirmedCases: confirmedCasesDataSetValues = caseEpiAnalysis(
    casesData,
    dataSources.confirmedCases,
    adjustingPeriod
  );

  const cli: cliDataSetValues = cliEpiAnalysis(
    cliData,
    dataSources.cli,
    adjustingPeriod
  );
  const ili: iliDataSetValues = iliEpiAnalysis(
    iliData,
    dataSources.ili,
    adjustingPeriod
  );

  const positivity: positivityDataSetValues = testEpiAnalysis(
    testsData,
    dataSources.tests,
    adjustingPeriod
  );

  let hospitalCapacity: hospitalDataSetValues = hospitalAnalysis(
    hosp,
    dataSources.hospitalCapacity,
    adjustingPeriod,
    phase
  );

  const report: CovidStats = {
    version: "1.0",
    fips,
    dataSets: {
      confirmedCases,
      cli,
      ili,
      positivity,
      hospitalCapacity
    }
  };
  return report;
}

const stateCases = require("../_scratch/stateCases.json");
const stateCLI = require("../_scratch/stateCLI.json");
const stateILI = require("../_scratch/stateILI.json");
const stateHospitals = require("../_scratch/stateHosp.json");
const stateTests = require("../_scratch/stateTests.json");

// const countyILI = require("../_scratch/countyILI.json");
// const countyTests = require("../_scratch/countyTests.json");

let countyCasesByFips = null;
try {
  const countyCases = require("../_scratch/countyCases.json");

  countyCasesByFips = countyCases.reduce(fipsReducer, {});
} catch (e) {
  console.log("Case county error");
}
let countyCLIByFips = null;
try {
  const countyCLI = require("../_scratch/countyCLI.json");
  countyCLIByFips = countyCLI.reduce(fipsReducer, {});
} catch (e) {
  console.log("CLI county error");
}
// const countyILIByFips = countyILI.reduce(fipsReducer, {});
// const countyTestsByFips = countyTests.reduce(fipsReducer, {});

function fipsReducer(acc, d) {
  const { fips } = d;
  if (!(fips in acc)) {
    acc[fips] = [];
  }
  acc[fips].push(d);
  return acc;
}
const reportFolder = path.join(__dirname, "..", "_scratch", "reports");
if (!fs.existsSync(reportFolder)) {
  fs.mkdirSync(reportFolder, { recursive: true });
}
export function generateReports(dataSources, stateFips, adjustingPeriod) {
  const stateReport = createReport(
    dataSources,
    stateFips,
    stateCases,
    stateCLI,
    stateILI,
    stateHospitals,
    stateTests,
    adjustingPeriod
  );
  stateReport.dataSets.countyData = { data: {} };

  const reports = {};
  try {
    Object.keys(countyCLIByFips).forEach(fip => {
      if (fip in reports) {
        reports[fip].cli = countyCLIByFips[fip];
        return;
      }
      reports[fip] = { cli: countyCLIByFips[fip] };
      return;
    });
  } catch (e) {
    console.log("No county CLI by fips");
  }

  try {
    Object.keys(countyCasesByFips).forEach(fip => {
      if (fip in reports) {
        reports[fip].cases = countyCasesByFips[fip];
        return;
      }
      reports[fip] = { cases: countyCasesByFips[fip] };
      return;
    });
  } catch (e) {
    console.log("No county cases by fips");
  }

  Object.keys(reports).forEach(fip => {
    const report = createReport(
      dataSources,
      fip,
      reports[fip].cases,
      reports[fip].cli,
      reports[fip].ili,
      reports[fip].hosp,
      reports[fip].tests,
      3
    );
    stateReport.dataSets.countyData.data[fip] = {};
    try {
      stateReport.dataSets.countyData.data[fip].confirmedCases = {
        ...report.dataSets.confirmedCases.data[
          report.dataSets.confirmedCases.data.length - 1
        ],
        analysis:
          report.dataSets.confirmedCases.data[
            report.dataSets.confirmedCases.data.length - 1
          ].analysis,
        daysMet:
          report.dataSets.confirmedCases.data[
            report.dataSets.confirmedCases.data.length - 1
          ].daysMet,
        date:
          report.dataSets.confirmedCases.data[
            report.dataSets.confirmedCases.data.length - 1
          ].date
      };
    } catch (e) {}
    try {
      stateReport.dataSets.countyData.data[fip].cli = {
        analysis:
          report.dataSets.cli.data[report.dataSets.cli.data.length - 1]
            .analysis,
        date: report.dataSets.cli.data[report.dataSets.cli.data.length - 1].date
      };
    } catch (e) {}

    fs.writeFileSync(
      path.join(__dirname, "..", "_scratch", "reports", `${fip}.json`),
      JSON.stringify(report)
    );
  });
  fs.writeFileSync(
    path.join(__dirname, "..", "_scratch", "reports", `${38000}.json`),
    JSON.stringify(stateReport)
  );
}
