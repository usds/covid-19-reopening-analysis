import moment from "moment";

import {
  getBaseCategory,
  SyndromicEpiCategories,
  RawSyndromicData,
  SyndromicDataWithCategory,
  SyndromicDataWithDecline
} from "./analysis";
import {
  synIncompleteRecoveryExplanation,
  synRelapseExplanation,
  synCurrentVisitsHigherThanTrendStartExplanation,
  synIncompleteRecoveryTitle,
  synRelapseTitle,
  synCurrentVisitsHigherThanTrendStartTitle
} from "./explanations";
import { cliDataSetValues, SyndromicSpline, Status } from "../src/types/report";

const GRACE_PERIOD = 5;
const ELV_INC_CAT: SyndromicEpiCategories[] = [
  "plateau",
  "growth",
  "missing_data"
];
const DOWNWARD_TREND_CAT: SyndromicEpiCategories[] = ["decline"];

function categoryBaselineMap() {
  // No current
  return function getCategoryBaselineMod(
    e: RawSyndromicData
  ): SyndromicDataWithCategory {
    const { deriv, count, cumulativeCount, n2wk } = e;
    if (typeof deriv != "number" || typeof count != "number") {
      return { ...e, analysis: "missing_data" };
    }

    if (cumulativeCount === 0) {
      return { ...e, analysis: "none" };
    }
    const analysis = getBaseCategory(deriv, 0);
    return { ...e, analysis };
  };
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
  let sustainedDeclineStart = 0;
  let notMetExplanation = "";
  let notMetTitle = "";

  return function getNumberDaysDecline(
    e: SyndromicDataWithCategory
  ): SyndromicDataWithDecline {
    const { analysis, spline } = e;

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
          notMetExplanation = synIncompleteRecoveryExplanation;
          notMetTitle = synIncompleteRecoveryTitle;
        } else {
          notMetExplanation = synRelapseExplanation;
          notMetTitle = synRelapseTitle;
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
        sustainedDeclineStart = spline;
      }
      if (daysMet > 14) {
        notMetExplanation = "";
        notMetTitle = "";
        reboundEligible = true;
        if (sustainedDeclineStart > spline) {
          met = true;
        } else {
          notMetExplanation = synCurrentVisitsHigherThanTrendStartExplanation;
          notMetTitle = synCurrentVisitsHigherThanTrendStartTitle;
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

export function cliEpiAnalysis(
  data: RawSyndromicData[],
  dataSources,
  adjustingPeriod = 0
): cliDataSetValues {
  if (!data) {
    return null;
  }
  const dataWithBaseLine = data.map(categoryBaselineMap());
  const dataWithDaysDecline = dataWithBaseLine.map(daysMetMap());
  const mostRecentDataPoint = dataWithDaysDecline.slice(-1)[0];
  const notMetTitle = mostRecentDataPoint.notMetTitle;
  return {
    data: dataWithDaysDecline.slice(-60).map(cliRemap),
    dataValidThrough: mostRecentDataPoint.date,
    updatedDate: moment(mostRecentDataPoint.date)
      .add(adjustingPeriod, "days")
      .valueOf(),
    met: mostRecentDataPoint.met,
    notMetExplanation: mostRecentDataPoint.notMetExplanation,
    dataSources,
    notMetTitle
  };
}
function cliRemap(e: SyndromicDataWithDecline): SyndromicSpline {
  const { date, count, spline, daysMet, analysis, status } = e;
  return {
    date,
    count,
    spline,
    daysMet,
    analysis,
    status
  };
}
