export type CaseEpiCategories =
  | "none"
  | "nonepast2wk"
  | "lowimpact"
  | "lessthan5"
  | "decline"
  | "low incidence growth"
  | "elevated incidence growth"
  | "low incidence plateau"
  | "elevated incidence plateau"
  | "missing_data";
export type SyndromicEpiCategories =
  | "none"
  | "growth"
  | "plateau"
  | "decline"
  | "missing_data";
export type TestEpiCategories =
  | "none"
  | "no_tests"
  | "growth"
  | "plateau"
  | "decline"
  | "decreasing_total_tests"
  | "near_zero"
  | "missing_data";

export type RobustTestEpiCategories =
  | "reporting_inadequate"
  | "high_positive_tests"
  | "robustness_met"
  | "missing_data";

export type HospEpiCategories =
  | "missing_data"
  | "decline"
  | "growth"
  | "plateau";
export type Status = "count" | "growth" | "grace period" | "missing";

export type DataSources = { name: String; link?: string };
export interface CountyData {
  confirmedCases?: {
    analysis: CaseEpiCategories;
    daysMet: number;
    date: number;
  };
  cli?: { analysis: SyndromicEpiCategories; date: number };
}
export interface SplineData {
  // date as milliseconds since the Unix Epoch
  date: number;
  count: number;
  spline: number;
  // analysis: CaseEpiCategories | string;
  daysMet: number;
  incomplete?: boolean;
  status: Status;
}
export interface CaseSpline extends SplineData {
  analysis: CaseEpiCategories;
}
export interface SyndromicSpline extends SplineData {
  analysis: SyndromicEpiCategories;
}

export interface TestsData {
  // date as milliseconds since the Unix Epoch
  date: number;
  percentPositive: number;
  percentPositiveSpline: number;
  positive: number;
  total: number;
  incomplete?: boolean;
  // totalSpline: number;

  positivityAnalysis: TestEpiCategories;
  positivityDaysMet: number;
  positivityIncomplete?: boolean;
  positivityStatus: Status;

  medianTimeToTest?: number;
  robustAnalysis: RobustTestEpiCategories;
  robustDaysMet: number;
  robustIncomplete?: boolean;
}
export interface HospitalData {
  date: number;
  incomplete?: boolean;
  insuffienctPPEPercent: number;
  hospMissingPPE: number;
  staffShortagePercent: number;
  hospCount: number;
  icuOccupancyPercentage: number;
  c19InpatientBurdenPercentage: number;
  c19BurdenDeriv: number;
  c19BurdenSpline: number;
  daysMet: number;
  status: string;
}

export interface dataSetValues {
  dataSources?: DataSources[];
  dataValidThrough?: number;
  updatedDate?: number;
  met?: boolean;
  notMetExplanation?: string;
  notMetTitle?: string;
}
export interface iliDataSetValues extends dataSetValues {
  data: SyndromicSpline[];
}
export interface cliDataSetValues extends dataSetValues {
  data: SyndromicSpline[];
}
export interface confirmedCasesDataSetValues extends dataSetValues {
  data: CaseSpline[];
}
export interface hospitalDataSetValues extends dataSetValues {
  data: HospitalData[];
}
export interface robustTestingDataSetValues extends dataSetValues {
  data: TestsData[];
}
export interface positivityDataSetValues extends dataSetValues {
  data: TestsData[];
}
export interface countyDataSetValues extends dataSetValues {
  data: { [fips: string]: CountyData };
}

export interface CovidStats {
  // Version
  version?: string;
  // state or county fips
  fips: string | number;
  dataSets: {
    ili?: iliDataSetValues;
    cli?: cliDataSetValues;
    confirmedCases?: confirmedCasesDataSetValues;
    positivity?: positivityDataSetValues;
    hospitalCapacity?: hospitalDataSetValues;
    testingProgram?: robustTestingDataSetValues;
    countyData?: countyDataSetValues;
  };
}

//#region status report
export type DataType = Partial<keyof CovidStats["dataSets"]>;

export type DataViewType =
  | "graphCLI"
  | "graphILI"
  | "graphDocumentedCases"
  | "mapDocumentedCases"
  | "positiveTestGraph"
  | "hospitalCapacityGraph"
  | "staffShortage"
  | "ppeSupply"
  | "testAvailabilityGraph"
  | "medianTestTime"
  | "override"
  | "mapCLI";

export interface DataView {
  type: DataViewType;
  titleOverride?: string;
  dataSource?: DataType;
  details?: string[];
  imageOverride?: {
    src: string;
    alt: string;
    caption?: string;
  };
}

export interface CriteriaDetail {
  criteriaName: string;
  criteriaDetails: string;
  dataSource: DataType;
  dataViews: DataView[];
  met?: boolean;
}

// JSON format that states have to provide.

export interface ReportDetails {
  stateFips: string;
  stateName: string;
  lastUpdated: number;
  reopenStatus: string;
  statusBody: string[];
  whatDoesThisMean: {
    phaseOne?: { text: string; link?: string }[];
    phaseTwo?: { text: string; link?: string }[];
    phaseThree?: { text: string; link?: string }[];
  };
  currentPhase: number;
  phaseTwoStartDate?: string;
  phaseThreeStartDate?: string;
  phaseDetails: (CriteriaDetail | CriteriaDetail[])[];
  covidStats?: CovidStats;
}
//#endregion
// export interface AppState extends ReportDetails {
//     stateFips: string;
//     stateName: string;
//     lastUpdated:string;
//     reportFips: string; // FIPS
//     data: CovidStats
//     _data: {
//       [fips:string]:CovidStats
//     }
//   }
