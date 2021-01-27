import moment from "moment";
import {
  getBaseCategory,
  RawTestData,
  TestDataWithCategory,
  TestEpiCategories,
  TestDataWithDecline
} from "./analysis";

import {
  testsIncompleteRecoveryTitle,
  testsIncompleteRecoveryExplanation,
  testsCurrentPercentHigherThanTrendStartTitle,
  testsCurrentPercentHigherThanTrendStartExplanation,
  decreasingVolumeTitle,
  decreasingVolumeExplanation,
  positiveTestDecreaseTitle,
  postiveTestDecreaseExplanation
} from "./explanations";

import {
  TestsData,
  positivityDataSetValues,
  Status
} from "../src/types/report";

const GRACE_PERIOD = 5;
const LOW_POSITIVITY_LEVEL = 0.02;
const TESTS_DECREASING_CUT_SLOPE = -0.1;
const TOTAL_TESTS_CDC_GREEN = 1000;
const ELV_INC_CAT: TestEpiCategories[] = [
  "growth",
  "decreasing_total_tests",
  "missing_data",
  "plateau"
];
const DOWNWARD_TREND_CAT: TestEpiCategories[] = ["decline", "near_zero"];

function positivityCategoryMap(e: RawTestData): TestDataWithCategory {
  const {
    percentPositive,
    totalDeriv,
    percentPositiveDeriv,
    total,
    totalCumulative,
    percentPositiveCumulative,
    totalPer100kCap
  } = e;
  if (
    typeof total != "number" ||
    typeof percentPositive != "number" ||
    typeof totalDeriv != "number" ||
    typeof percentPositiveDeriv != "number"
  ) {
    return { ...e, positivityAnalysis: "missing_data" };
  }
  if (totalCumulative == 0) {
    return { ...e, positivityAnalysis: "no_tests" };
  }
  if (percentPositiveCumulative == 0) {
    return { ...e, positivityAnalysis: "none" };
  }

  if (
    totalDeriv <= TESTS_DECREASING_CUT_SLOPE &&
    totalPer100kCap < TOTAL_TESTS_CDC_GREEN
  ) {
    return { ...e, positivityAnalysis: "decreasing_total_tests" };
  }
  if (percentPositive < LOW_POSITIVITY_LEVEL) {
    return { ...e, positivityAnalysis: "near_zero" };
  }

  const positivityAnalysis = getBaseCategory(percentPositiveDeriv, 0);
  return { ...e, positivityAnalysis };
}
function daysMetMap() {
  let increasingTrendCount = 0;
  let daysMet = 0;

  let reboundEligible = false;

  let currentState:
    | "initialdecline"
    | "growth"
    | "lowimpact"
    | "sustaineddecline" = "lowimpact";
  let notMetExplanation = "";
  let notMetTitle = "";

  let sustainedDeclineStart = 0;
  return function getNumberDaysDecline(
    e: TestDataWithCategory
  ): TestDataWithDecline {
    const { positivityAnalysis, percentPositive } = e;

    let rebound = false;
    let met = false;
    let status: Status;

    if (ELV_INC_CAT.includes(positivityAnalysis)) {
      increasingTrendCount++;
      if (
        currentState == "sustaineddecline" &&
        increasingTrendCount <= GRACE_PERIOD
      ) {
        daysMet++;
        status = "grace period";
      } else {
        if (currentState === "initialdecline") {
          notMetExplanation = testsIncompleteRecoveryExplanation;
          notMetTitle = testsIncompleteRecoveryTitle;
        } else {
          if (positivityAnalysis === "decreasing_total_tests") {
            notMetExplanation = decreasingVolumeExplanation;
            notMetTitle = decreasingVolumeTitle;
          } else {
            notMetExplanation = postiveTestDecreaseExplanation;
            notMetTitle = positiveTestDecreaseTitle;
          }
        }
        currentState = "growth";
        status = "growth";
        daysMet = 0;
        if (reboundEligible) {
          rebound = true;
        }
      }
    }
    if (DOWNWARD_TREND_CAT.includes(positivityAnalysis)) {
      daysMet++;
      increasingTrendCount = 0;
      status = "count";
      if (daysMet > 5) {
        currentState = "sustaineddecline";
      } else if (daysMet > 0) {
        currentState = "initialdecline";
      }
      if (daysMet == 1) {
        sustainedDeclineStart = percentPositive;
      }
      if (daysMet > 14) {
        notMetExplanation = "";
        notMetTitle = "";
        reboundEligible = true;
        if (
          sustainedDeclineStart > percentPositive ||
          percentPositive <= LOW_POSITIVITY_LEVEL
        ) {
          met = true;
        } else {
          notMetTitle = testsCurrentPercentHigherThanTrendStartTitle;
          notMetExplanation = testsCurrentPercentHigherThanTrendStartExplanation;
        }
      }
    }
    return {
      ...e,
      rebound,
      positivityMet: met,
      positivitynotMetExplanation: notMetExplanation,
      positivityDaysMet: daysMet,
      positivityStatus: status,
      positivitynotMetTitle: notMetTitle
    };
  };
}
function robustAnalysis(e: TestDataWithDecline) {}
export function testEpiAnalysis(
  data: RawTestData[],
  dataSources,
  adjustingPeriod = 0
): positivityDataSetValues {
  if (!data) {
    return null;
  }
  const dataWithBaseLine = data.map(positivityCategoryMap);
  const dataWithDaysDecline = dataWithBaseLine.map(daysMetMap());
  const mostRecentDataPoint = dataWithDaysDecline.slice(-1)[0];
  const notMetTitle = mostRecentDataPoint.positivitynotMetTitle;
  return {
    data: dataWithDaysDecline.slice(-60).map(testsRemap),
    dataValidThrough: mostRecentDataPoint.date,
    updatedDate: moment(mostRecentDataPoint.date)
      .add(adjustingPeriod, "days")
      .valueOf(),
    met: mostRecentDataPoint.positivityMet,
    notMetExplanation: mostRecentDataPoint.positivitynotMetExplanation,
    dataSources,
    notMetTitle
  };
}

function testsRemap(e: TestDataWithDecline): TestsData {
  const {
    date,
    percentPositive,
    percentPositiveSpline,
    positive,
    total,
    positivityAnalysis,
    positivityDaysMet,
    positivityStatus
  } = e;

  return {
    date,
    percentPositive,
    percentPositiveSpline,
    positive,
    total,
    positivityAnalysis,
    positivityDaysMet,
    positivityStatus,
    medianTimeToTest: null,
    robustAnalysis: null,
    robustDaysMet: null,
    robustIncomplete: true
  };
}
