import Axios from "axios";
import moment, { Moment } from "moment";

import { ReportDetails, CovidStats, SplineData, TestsData } from "types/report";

// TODO: these should be buildtime env vars.
// const apiRoot = "https://www.localhost.gov/";
interface CovidStatsStore {
  [key: string]: CovidStats;
}

const padData = (
  data: any,
  maxDate: Moment,
  filler: (date: number) => object
) => {
  let startDate = moment(data[data.length - 1].date);
  let padDays = maxDate.diff(startDate, "days");
  // If the backend isn't borken this should be at least 3
  return data.concat(
    Array(padDays)
      .fill(0)
      .map((_, i) =>
        filler(
          moment(startDate)
            .add(i + 1, "days")
            .valueOf()
        )
      )
  );
};

const incompleteSplineData = (date: number): SplineData => ({
  date,
  count: 0,
  spline: 0,
  daysMet: 0,
  status: "missing",
  incomplete: true
});

const incompleteTestsData = (date: number): TestsData => ({
  date,
  percentPositive: 0,
  percentPositiveSpline: 0,
  positive: 0,
  total: 0,
  incomplete: true,
  positivityAnalysis: "missing_data",
  positivityDaysMet: 0,
  positivityIncomplete: true,
  positivityStatus: "missing",
  robustAnalysis: "missing_data",
  robustDaysMet: 0
});

const incompleteHospitalData = (date: number) => ({
  date,
  criticalCareAvail: 0,
  criticalCareCapacity: 0,
  ventilatorsAvail: 0,
  ventilatorsCapacity: 0,
  inpatientCareAvail: 0,
  inpatientCareCap: 0,
  incomplete: true
});

type CovidTestKey = Partial<keyof CovidStats["dataSets"]>;

const dataSetInfo: {
  name: CovidTestKey;
  filler: (e: any) => any;
}[] = [
  { name: "ili", filler: incompleteSplineData },
  { name: "cli", filler: incompleteSplineData },
  { name: "confirmedCases", filler: incompleteSplineData },
  { name: "positivity", filler: incompleteTestsData },
  { name: "hospitalCapacity", filler: incompleteHospitalData }
];

// Reduce data to what we'll analyze, mark recent days as incomplete
// ASSUMPTIONS
//  * Incoming datasets have been truncated to remove incomplete recent days
//  * Last date in incoming dataset is valid data, we pad beyond that
//  * The .updatedDates are the last date where incomplete data was collected

function normalizeStatsInPlace(stats: CovidStats) {
  // Get latest date in datasets to normalize graph ends
  const lastValid = Math.max(
    stats.dataSets.cli?.updatedDate || 0,
    stats.dataSets.ili?.updatedDate || 0,
    stats.dataSets.confirmedCases?.updatedDate || 0,
    stats.dataSets.hospitalCapacity?.updatedDate || 0,
    stats.dataSets.positivity?.updatedDate || 0,
    stats.dataSets.testingProgram?.updatedDate || 0
  );

  // Pad datasets at the end with incomplete records
  const maxDate = moment(lastValid);
  for (const { name, filler } of dataSetInfo) {
    let data = stats.dataSets[name]?.data;
    if (Array.isArray(data) && stats.dataSets[name]) {
      // @ts-ignore
      stats.dataSets[name].data = padData(data, maxDate, filler);
    }
  }
  return stats;
}
// //Todo: error handling

async function getReportData(): Promise<ReportDetails> {
  const resp = await Axios.get<ReportDetails>(
    `${process.env.PUBLIC_URL}/${process.env.REACT_APP_BASE_FIPS}_status.json`
  );
  return resp.data;
}

const _covidStats: CovidStatsStore = {};

const _reportData = getReportData();

export async function getCovidStats(
  fips: string | number
): Promise<ReportDetails> {
  if (!(fips in _covidStats)) {
    const resp = await Axios.get<CovidStats>(
      `${process.env.PUBLIC_URL}/covidstats/${fips}.json`
    );
    _covidStats[fips] = normalizeStatsInPlace(resp.data);
  }
  const reportData = await _reportData;

  reportData.phaseDetails.forEach(phase => {
    // TODO: pull all these back and refactor the data model
    if (Array.isArray(phase)) {
      phase.forEach(subPhase => {
        if (typeof subPhase.met === "undefined") {
          subPhase.met =
            _covidStats[fips].dataSets[subPhase.dataSource]?.met || false;
        }
      });
      return;
    }
    if (typeof phase.met === "undefined") {
      phase.met = _covidStats[fips].dataSets[phase.dataSource]?.met || false;
    }
  });

  reportData["covidStats"] = _covidStats[fips];
  reportData.lastUpdated = Math.max(
    _covidStats[fips].dataSets.cli?.updatedDate || 0,
    _covidStats[fips].dataSets.ili?.updatedDate || 0,
    _covidStats[fips].dataSets.confirmedCases?.updatedDate || 0,
    _covidStats[fips].dataSets.positivity?.updatedDate || 0,
    _covidStats[fips].dataSets.testingProgram?.updatedDate || 0,
    _covidStats[fips].dataSets.hospitalCapacity?.updatedDate || 0
  );
  return reportData;
}
