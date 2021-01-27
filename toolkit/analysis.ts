export type BaseEpiCategories = "growth" | "plateau" | "decline";
import {
  CaseEpiCategories,
  SyndromicEpiCategories,
  TestEpiCategories,
  RobustTestEpiCategories,
  HospEpiCategories,
  Status
} from "../src/types/report";
export {
  CovidStats,
  SyndromicSpline,
  CaseSpline,
  TestsData,
  CaseEpiCategories,
  SyndromicEpiCategories,
  TestEpiCategories,
  RobustTestEpiCategories
} from "../src/types/report";
export interface RawCaseData {
  date: number;
  spline: number;
  deriv: number;
  ci2wk: number;
  count: number;
  cumulativeCount: number;
  n2wk: number;
  incomplete?: boolean;
}
export interface CaseDataWithCategory extends RawCaseData {
  analysis: CaseEpiCategories;
}
export interface CaseDataWithDecline extends CaseDataWithCategory {
  daysMet: number;
  rebound: boolean;
  notMetExplanation: string;
  notMetTitle: string;
  met: boolean;
  status: Status;
}

// Syndromic
export interface RawSyndromicData {
  deriv: number;
  count: number;
  date: number;
  spline: number;
  n2wk: number;
  cumulativeCount: number;
}
export interface SyndromicDataWithCategory extends RawSyndromicData {
  analysis: SyndromicEpiCategories;
}

export interface SyndromicDataWithDecline extends SyndromicDataWithCategory {
  daysMet: number;
  notMetExplanation: string;
  notMetTitle: string;
  rebound: boolean;
  met: boolean;
  status: Status;
}
// Tests
export interface RawTestData {
  date: number;
  positive: number;
  total: number;
  percentPositive: number;
  percentPositiveSpline: number;
  totalDeriv: number;
  percentPositiveDeriv: number;
  medianTimeToTest?: number;
  totalCumulative: number;
  percentPositiveCumulative: number;
  totalPer100kCap: number;
}
export interface TestDataWithCategory extends RawTestData {
  positivityAnalysis: TestEpiCategories;
}
export interface RobustTestDataWithCategory extends RawTestData {
  analysis: RobustTestEpiCategories;
}
export interface RobustTestDataWithDecline extends RobustTestDataWithCategory {
  daysMet: number;
}
export interface RawHospData {
  date: number;
  hospCount: number;
  insuffienctPPEPercent: number;
  hospMissingPPE?: number;
  staffShortagePercent: number;
  icuOccupancyPercentage: number;
  c19InpatientBurdenPercentage: number;
  c19BurdenDeriv: number;
  c19BurdenSpline: number;
}
export interface TestDataWithDecline extends TestDataWithCategory {
  positivityDaysMet: number;
  rebound: boolean;
  positivityMet: boolean;
  positivitynotMetExplanation: string;
  positivitynotMetTitle: string;
  positivityStatus: Status;
}
export interface HospDataWithCategory extends RawHospData {
  analysis: HospEpiCategories;
}
export interface HospDataWithMet extends HospDataWithCategory {
  daysMet: number;
  met: boolean;
  rebound: boolean;
  notMetExplanation: string;
  notMetTitle: string;
  status: Status;
}

export function getBaseCategory(
  deriv: number,
  plateauThreshold = 0.1
): BaseEpiCategories {
  if (deriv > plateauThreshold) {
    return "growth";
  }
  if (deriv >= 0) {
    return "plateau";
  }
  return "decline";
}
