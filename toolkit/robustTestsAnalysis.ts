import {
  RobustTestEpiCategories,
  RawTestData,
  RobustTestDataWithCategory,
  RobustTestDataWithDecline
} from "./analysis";

const MET: RobustTestEpiCategories = "robustness_met";

function categoryBaselineMap(phaseThreshold = 3) {
  let postiveMax = 0.1;
  let medianTimeToTestMax = 2;
  if ((phaseThreshold = 1)) {
    postiveMax = 0.2;
    medianTimeToTestMax = 4;
  }
  if ((phaseThreshold = 2)) {
    postiveMax = 0.15;
    medianTimeToTestMax = 3;
  }
  return function getCategoryBaselineMod(
    e: RawTestData
  ): RobustTestDataWithCategory {
    const { positive, total, medianTimeToTest } = e;
    if (
      typeof positive != "number" ||
      typeof total != "number" ||
      typeof medianTimeToTest != "number"
    ) {
      return { ...e, analysis: "missing_data" };
    }
    const dailyPercentPositive = positive / total;
    if (dailyPercentPositive > postiveMax) {
      return { ...e, analysis: "high_positive_tests" };
    }
    if (medianTimeToTest < medianTimeToTestMax) {
      return { ...e, analysis: "reporting_inadequate" };
    }
    return { ...e, analysis: "robustness_met" };
  };
}
function daysMetMap() {
  let daysMet = 0;
  return function getNumberDaysDecline(
    e: RobustTestDataWithCategory
  ): RobustTestDataWithDecline {
    const { analysis } = e;
    daysMet++;
    if (analysis !== MET) {
      daysMet = 0;
    }
    return { ...e, daysMet };
  };
}
export function robustTestAnalysis(data) {
  const dataWithBaseLine = data.map(categoryBaselineMap());
  const dataWithDaysDecline = dataWithBaseLine.map(daysMetMap());
  return {
    data: dataWithDaysDecline,
    lastDataPoint: dataWithDaysDecline[dataWithDaysDecline.length - 1].date,
    met: dataWithDaysDecline[dataWithDaysDecline.length - 1].datsMet >= 14
  };
}
