import moment from "moment";
import {
  confirmedCasesDataSetValues,
  CaseSpline,
  Status
} from "../src/types/report";

import {
  getBaseCategory,
  CaseEpiCategories,
  RawCaseData,
  CaseDataWithCategory,
  CaseDataWithDecline
} from "./analysis";

import {
  caseRelapseExplanation,
  caseIncompleteRecoveryExplanation,
  caseCurrentIncidenceHigherThanTrendStartExplanation,
  caseIncompleteRecoveryTitle,
  caseRelapseTitle,
  caseCurrentIncidenceHigherThanTrendStartTitle
} from "./explanations";

const GRACE_PERIOD = 5;

const ELV_INC_CAT: CaseEpiCategories[] = [
  "elevated incidence plateau",
  "elevated incidence growth",
  "low incidence growth",
  "missing_data"
];
const DOWNWARD_TREND_CAT: CaseEpiCategories[] = [
  "decline",
  "low incidence plateau",
  "lessthan5",
  "nonepast2wk"
];
const CUT_RATE_2WK_INC = 10;

function categoryBaselineMap() {
  // REF: ifelse(any(df$category[1:ti] %in% c("elevated incidence plateau", "elevated incidence growth")) &
  // 0kl: we handled the identification of prior elevated incidence here, rather than in the days
  // in decline area
  let impactedByCovid19 = false;

  return function getCategoryBaselineMod(e: RawCaseData): CaseDataWithCategory {
    const { deriv, ci2wk, count, cumulativeCount, n2wk } = e;
    if (
      typeof deriv != "number" ||
      typeof count != "number" ||
      typeof ci2wk != "number"
    ) {
      return { ...e, analysis: "missing_data" };
    }
    if (ci2wk > CUT_RATE_2WK_INC) {
      impactedByCovid19 = true;
    }

    if (!impactedByCovid19) {
      if (cumulativeCount === 0) {
        // REF: # If CI is zero, there have been no cases
        return { ...e, analysis: "none" };
      }
      return { ...e, analysis: "lowimpact" };
    }
    if (n2wk <= 5) {
      // REF: ## If there are no cases in the past two weeks
      // REF: ## If there are 5 or fewer cases in the past two weeks
      // 0kl: Bundling these up since we do not use the `nonepast2wk` epi cat
      return { ...e, analysis: "lessthan5" };
    }

    const baseCategory = getBaseCategory(deriv);

    // REF: # The first 5 days of a decline should be a plateau
    // REF: ##sustained decline only after 5 days
    // REF: # Change declines to plateau if the decline has occurred over 5 days or less
    // 0kl:Breaking with the CDC codebase here because we are looking for periods of decline and do the analysis of days in decline separately
    if (baseCategory === "decline") {
      return { ...e, analysis: "decline" };
    }

    // REF: # If it's in the first two weeks, use the cumulative incidence
    // 0kl: handled in the R script for incidence
    // REF: ##add incidence label for plateaus and growth
    if (ci2wk <= CUT_RATE_2WK_INC) {
      if (baseCategory === "growth") {
        return { ...e, analysis: "low incidence growth" };
      }
      return { ...e, analysis: "low incidence plateau" };
    }

    if (baseCategory === "growth") {
      return { ...e, analysis: "elevated incidence growth" };
    }
    return { ...e, analysis: "elevated incidence plateau" };
  };
}

function daysInDeclineMap() {
  //  elevatedIncidenceCount = EI
  let elevatedIncidenceCount = 0;
  // daysMet = DT
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
  // REF: # calculate the number of days in a downward trend
  return function getNumberDaysDeclineFromCumulativeCountBaselineMod(
    e: CaseDataWithCategory
  ): CaseDataWithDecline {
    // REF: # Days count toward the downwardrend if there was preceding growth or EIP and slope < 0 or LIP
    // REF: # Any interruption of the downward trend resets the count t
    const { analysis, spline } = e;
    let rebound = false;
    let met = false;
    let status: Status;
    // Low incidence plateaus are only part of sustained declines...
    let localAnalysis: CaseEpiCategories = analysis;
    if (analysis === "low incidence plateau") {
      if (currentState === "sustaineddecline") {
        localAnalysis = "decline";
      } else {
        localAnalysis = "low incidence growth";
      }
    }

    if (ELV_INC_CAT.includes(localAnalysis)) {
      // REF: df$category[ti] %in% c("elevated incidence plateau", "elevated incidence growth", "low incidence growth"), TRUE, FALSE)
      elevatedIncidenceCount++;
      if (
        currentState == "sustaineddecline" &&
        elevatedIncidenceCount <= GRACE_PERIOD
      ) {
        status = "grace period";
        daysMet++;
      } else {
        if (currentState === "initialdecline") {
          notMetExplanation = caseIncompleteRecoveryExplanation;
          notMetTitle = caseIncompleteRecoveryTitle;
        } else {
          notMetExplanation = caseRelapseExplanation;
          notMetTitle = caseRelapseTitle;
        }
        status = "growth";
        currentState = "growth";
        daysMet = 0;
        sustainedDeclineStart = 0;

        if (reboundEligible) {
          rebound = true;
        }
      }
    }
    if (DOWNWARD_TREND_CAT.includes(localAnalysis)) {
      // REF: ifelse(df$categorycate[ti] != "none" &
      // REF: any(df$category[1:ti] %in% c("elevated incidence plateau", "elevated incidence growth")) &
      // REF: (all(df$deriv1[(ti-5):ti] < 0) | df$category[ti] %in% c("low incidence plateau", "lessthan5", "nonepast2wk")),
      // By definition priorElevated precludes the "none" category. df$deriv1[(ti-5):ti] < 0 === "decline"
      daysMet++;
      elevatedIncidenceCount = 0;
      notMetExplanation = "";
      notMetTitle = "";

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
        reboundEligible = true;
        if (sustainedDeclineStart > spline) {
          met = true;
        } else {
          notMetExplanation = caseCurrentIncidenceHigherThanTrendStartExplanation;
          notMetTitle = caseCurrentIncidenceHigherThanTrendStartTitle;
        }
      }
    }

    return {
      ...e,
      rebound,
      met,
      daysMet,
      notMetExplanation,
      notMetTitle,
      status
    };
  };
}
export function caseEpiAnalysis(
  data: RawCaseData[],
  dataSources,
  adjustingPeriod = 0
): confirmedCasesDataSetValues {
  if (!data) {
    return null;
  }
  const dataWithBaseLine = data.map(categoryBaselineMap());
  const dataWithDaysDecline = dataWithBaseLine.map(daysInDeclineMap());
  const mostRecentDataPoint = dataWithDaysDecline.slice(-1)[0];
  const updatedDate = moment(mostRecentDataPoint.date)
    .add(adjustingPeriod, "days")
    .valueOf();
  return {
    data: dataWithDaysDecline.slice(-60).map(caseRemap),
    dataValidThrough: mostRecentDataPoint.date,
    updatedDate,
    met: mostRecentDataPoint.met,
    notMetExplanation: mostRecentDataPoint.notMetExplanation,
    notMetTitle: mostRecentDataPoint.notMetTitle,
    dataSources
  };
}

function missingData(e: CaseDataWithCategory[]): CaseDataWithCategory[] {
  let dates = e.map(e => e.date);
  let dateObject = e.reduce((acc, e) => {
    acc[e.date] = e;
    return acc;
  }, {});
  let maxDate = moment(Math.max(...dates));
  let minDate = moment(Math.min(...dates));
  let dateArray = [];
  while (minDate.valueOf() <= maxDate.valueOf()) {
    dateArray.push(minDate.valueOf);
    minDate = minDate.add(1, "day");
  }
  return dateArray.map(date => {
    if (dateObject[date]) {
      return dateObject[date];
    }
    return {
      date,
      count: 0,
      spline: 0,
      deriv: 0,
      ci2wk: 0,
      n2wk: 0,
      cumulativeCount: 0,
      incomplete: true
    };
  });
}
// function padData(
//   e: CaseDataWithDecline[],
//   mostRecent: number,
//   endDate: number
// ): CaseDataWithDecline[] {
//   let startDate = moment();
// }
function caseRemap(e: CaseDataWithDecline): CaseSpline {
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
