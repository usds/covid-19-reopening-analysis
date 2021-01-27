import moment from "moment";
import {
  getBaseCategory,
  RawHospData,
  HospDataWithCategory,
  HospDataWithMet
} from "./analysis";
import {
  Status,
  HospEpiCategories,
  hospitalDataSetValues,
  HospitalData
} from "../src/types/report";
import {
  hospitalC19BurdenRelapseExplanation,
  hospitalICUOccupancyTooHigh,
  hopsitalC19InpatientBurdenTooHigh,
  hospitalsTooLowOnPPE,
  hospitalsStaffShortage,
  hospitalsHigherThanStart
} from "./explanations";

const ELV_INC_CAT: HospEpiCategories[] = ["plateau", "growth", "missing_data"];
const DOWNWARD_TREND_CAT: HospEpiCategories[] = ["decline"];

const OCCUPANCY_MIN = 0.8;
const GRACE_PERIOD = 5;
function categoryBaselineMap(phaseThreshold = 3) {
  return function getCategoryBaselineMod(e: RawHospData): HospDataWithCategory {
    const { c19BurdenDeriv } = e;
    if (typeof c19BurdenDeriv != "number") {
      return { ...e, analysis: "missing_data" };
    }
    return { ...e, analysis: getBaseCategory(c19BurdenDeriv) };
  };
}
function daysMetMap(phaseThreshold = 3) {
  let daysMet = 0;
  let percentMissingPPEMin = 0;
  let percentLowStaffMin = 0.05;
  let covid19InpatientBurdenMin = 0.05;
  if (phaseThreshold === 1) {
    percentMissingPPEMin = 0.05;
    percentLowStaffMin = 0.1;
    covid19InpatientBurdenMin = 0.15;
  }
  if (phaseThreshold === 2) {
    percentMissingPPEMin = 0.03;
    percentLowStaffMin = 0.1;
    covid19InpatientBurdenMin = 0.1;
  }
  let increasingTrendCount = 0;
  let sustainedDeclineStart = 0;
  let currentState:
    | "initialdecline"
    | "growth"
    | "lowimpact"
    | "sustaineddecline" = "lowimpact";
  let notMetExplanation = "";
  let notMetTitle = "";
  let reboundEligible = false;
  return function getNumberDaysDecline(
    e: HospDataWithCategory
  ): HospDataWithMet {
    const {
      analysis,
      c19BurdenSpline,
      insuffienctPPEPercent,
      staffShortagePercent,
      icuOccupancyPercentage,
      c19InpatientBurdenPercentage
    } = e;

    let rebound = false;
    let met = false;
    let status: Status;

    if (ELV_INC_CAT.includes(analysis)) {
      increasingTrendCount++;
      if (
        currentState == "sustaineddecline" &&
        increasingTrendCount <= GRACE_PERIOD
      ) {
        daysMet++;
        status = "grace period";
      } else {
        if (currentState === "initialdecline") {
          notMetTitle = "Relapse placeholder";
          notMetExplanation = hospitalC19BurdenRelapseExplanation;
        } else {
          notMetTitle = "Relapse placeholder";
          notMetExplanation = hospitalC19BurdenRelapseExplanation;
        }
        status = "growth";
        sustainedDeclineStart = 0;
        currentState = "growth";
        daysMet = 0;
        if (reboundEligible) {
          rebound = true;
        }
      }
    }
    if (DOWNWARD_TREND_CAT.includes(analysis)) {
      daysMet++;
      increasingTrendCount = 0;
      status = "count";
      if (daysMet > 5) {
        currentState = "sustaineddecline";
      } else {
        currentState = "initialdecline";
      }
      if (daysMet == 1) {
        sustainedDeclineStart = c19BurdenSpline;
      }
      if (daysMet > 14) {
        notMetExplanation = "";
        notMetTitle = "";
        reboundEligible = true;
        if (icuOccupancyPercentage > OCCUPANCY_MIN) {
          notMetTitle = "Occupancy";
          notMetExplanation = hospitalICUOccupancyTooHigh;
        } else if (c19InpatientBurdenPercentage > covid19InpatientBurdenMin) {
          notMetTitle = "Inpatient Burden";
          notMetExplanation = hopsitalC19InpatientBurdenTooHigh;
        } else if (insuffienctPPEPercent < percentMissingPPEMin) {
          notMetTitle = "Personal Protective Equipment";
          notMetExplanation = hospitalsTooLowOnPPE;
        } else if (staffShortagePercent < percentLowStaffMin) {
          notMetTitle = "Staff";
          notMetExplanation = hospitalsStaffShortage;
        } else if (sustainedDeclineStart < c19BurdenSpline) {
          notMetTitle = "Sustained Decline";
          notMetExplanation = hospitalsHigherThanStart;
        } else {
          met = true;
        }
      }
    }

    return {
      ...e,
      daysMet,
      met,
      rebound,
      notMetExplanation,
      notMetTitle,
      status
    };
  };
}
export function hospitalAnalysis(
  data: RawHospData[],
  dataSources,
  adjustingPeriod = 0,
  phaseThreshhold = 3
): hospitalDataSetValues {
  if (!data) {
    return null;
  }
  const dataWithBaseLine = data.map(categoryBaselineMap(phaseThreshhold));
  const dataWithDaysDecline = dataWithBaseLine.map(daysMetMap(phaseThreshhold));
  const mostRecentDataPoint = dataWithDaysDecline.slice(-1)[0];
  const notMetTitle = mostRecentDataPoint.notMetTitle;
  const notMetExplanation = mostRecentDataPoint.notMetExplanation;
  const met = mostRecentDataPoint.met;
  const dataValidThrough = mostRecentDataPoint.date;

  return {
    data: dataWithDaysDecline.slice(-60).map(hospRemap),
    updatedDate: moment(mostRecentDataPoint.date)
      .add(adjustingPeriod, "days")
      .valueOf(),
    notMetTitle,
    notMetExplanation,
    met,
    dataValidThrough,
    dataSources
  };
}

function hospRemap(e: HospDataWithMet): HospitalData {
  const {
    date,
    hospCount,
    insuffienctPPEPercent,
    hospMissingPPE,
    staffShortagePercent,
    icuOccupancyPercentage,
    c19InpatientBurdenPercentage,
    c19BurdenDeriv,
    c19BurdenSpline,
    rebound,
    analysis,
    daysMet,
    met,
    notMetExplanation,
    notMetTitle,
    status
  } = e;
  return {
    date,
    insuffienctPPEPercent,
    hospMissingPPE,
    staffShortagePercent,
    hospCount,
    icuOccupancyPercentage,
    c19InpatientBurdenPercentage,
    c19BurdenDeriv,
    c19BurdenSpline,
    daysMet,
    status
  };
}
