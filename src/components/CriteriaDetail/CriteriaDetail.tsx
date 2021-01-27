import React from "react";
import moment from "moment";

import {
  CriteriaDetail,
  CovidStats,
  SplineData,
  TestsData,
  HospitalData,
  CountyData,
  DataViewType,
  DataSources,
  iliDataSetValues,
  cliDataSetValues,
  confirmedCasesDataSetValues,
  hospitalDataSetValues,
  robustTestingDataSetValues,
  positivityDataSetValues,
  countyDataSetValues
} from "types/report";
import ProgressDisplay from "components/ProgressDisplay/ProgressDisplay";
import { MapCasesDisplay } from "./CasesMapDisplay";
import { GraphCasesDisplay } from "./CasesGraphDisplay";
import { HospitalDisplay } from "./HospitalDisplay";
import { PpeSupplyDisplay } from "./PpeSupplyDisplay";
import { TestTimeDisplay } from "./TestTimeDisplay";
import { TestAvailabilityDisplay } from "./TestAvailabilityDisplay";
import { MapCLIDisplay } from "./CLIMapDisplay";
import { StaffDisplay } from "./StaffDisplay";
import { GraphCLIDisplay } from "./CLIGraphDisplayMobile";
import { GraphILIDisplay } from "./ILIGraphDisplay";
import { TestPositiveDisplay } from "./TestPositiveDisplay";

export type ViewTypes =
  | "graphCLI"
  | "mapCLI"
  | "graphILI"
  | "mapDocumentedCases"
  | "positiveTestGraph"
  | "hosptalCapacityGraph"
  | "staffShortage"
  | "ppeSupply"
  | "testAvailabilityGraph"
  | "medianTestTime";

export interface DataView {
  type: DataViewType;
  titleOverride?: string;
  details?: string[];
}

const StubComponent: React.FC<{}> = () => <div></div>;

export interface DataDisplayProps extends DataView {
  data:
    | iliDataSetValues
    | cliDataSetValues
    | confirmedCasesDataSetValues
    | hospitalDataSetValues
    | robustTestingDataSetValues
    | positivityDataSetValues
    | countyDataSetValues;
  stateName: string;
  imageOverride?: { src: string; alt?: string; caption?: string };
  updateFips: (fips: string) => void;
}
const DataDisplay: React.FC<DataDisplayProps> = ({
  type,
  titleOverride,
  imageOverride,
  details,
  data,
  stateName,
  updateFips
}) => {
  let title;
  let analysis: Partial<keyof CovidStats["dataSets"]> | null = null;

  if (!titleOverride) {
    switch (type) {
      case "graphCLI":
        title = `${stateName} reports of COVID-like illnesses`;
        break;
      default:
        title = "";
        break;
    }
  } else {
    title = titleOverride;
  }

  let DataDisplayComponent: React.FC<any> = StubComponent;
  let simpleDataName = "cases";
  const summaries: string[] = [];
  if (!imageOverride) {
    switch (type) {
      case "graphCLI":
        DataDisplayComponent = GraphCLIDisplay;
        analysis = "cli";
        simpleDataName = "reports of COVID-like illnesses";
        break;

      case "graphILI":
        DataDisplayComponent = GraphILIDisplay;
        analysis = "ili";
        simpleDataName = "reports of Influenza-like illnesses";
        break;
      case "graphDocumentedCases":
        DataDisplayComponent = GraphCasesDisplay;
        analysis = "confirmedCases";
        simpleDataName = "new documented cases of COVID-19";
        break;
      case "mapDocumentedCases":
        DataDisplayComponent = MapCasesDisplay;
        break;
      case "positiveTestGraph":
        DataDisplayComponent = TestPositiveDisplay;
        analysis = "positivity";
        simpleDataName = "positive tests";
        break;
      case "hospitalCapacityGraph":
        DataDisplayComponent = HospitalDisplay;
        analysis = "hospitalCapacity";
        break;
      case "staffShortage":
        DataDisplayComponent = StaffDisplay;
        break;
      case "testAvailabilityGraph":
        DataDisplayComponent = TestAvailabilityDisplay;
        analysis = "testingProgram";
        break;
      case "medianTestTime":
        DataDisplayComponent = TestTimeDisplay;
        break;
      case "ppeSupply":
        DataDisplayComponent = PpeSupplyDisplay;
        break;
      case "mapCLI":
        DataDisplayComponent = MapCLIDisplay;
        break;
      // allSources
      default:
        throw new Error(`${type} not available!`);
    }
    // allData
    // allSources
    // if (
    //   analysis === "confirmedCases" ||
    //   analysis === "cli" ||
    //   analysis === "ili"
    // ) {
    //   // Take a 14-day window
    //   const splineData = ((data.data as unknown) as SplineData[])
    //     .filter(e => !e.incomplete)
    //     .slice(-14);
    //   const lastPoint = splineData[splineData.length - 1];

    //   if (lastPoint.daysMet < 14) {
    //     summaries.push(
    //       `The ${simpleDataName} have not trended downward for 14 days or more.`
    //     );
    //   } else {
    //     summaries.push(
    //       `The ${simpleDataName} have trended downward for 14 days or more.`
    //     );
    //   }
    //   const lastDate = moment(lastPoint.date).format("MMMM D");
    //   const lastValue = lastPoint.count;
    //   summaries.push(
    //     `On ${lastDate}, the number of ${simpleDataName} is ${lastValue}.`
    //   );
    // } else if (analysis === "positivity") {
    //   const testsData = (data.data as TestsData[])
    //     .filter(e => !e.incomplete)
    //     .slice(-14);
    //   const lastPoint = testsData[testsData.length - 1];
    //   const lastDate = moment(lastPoint.date).format("MMMM D");
    //   const lastValue = ((100 * lastPoint.positive) / lastPoint.total).toFixed(
    //     0
    //   );
    //   summaries.push(
    //     `On ${lastDate}, the percentage of ${simpleDataName} is ${lastValue}%.`
    //   );
    // } else if (analysis === "testingProgram") {
    //   const testsData = ((data as any) as TestsData[])
    //     .filter(e => !e.incomplete)
    //     .slice(-14);
    //   const lastPoint = testsData[testsData.length - 1];
    //   const lastDate = moment(lastPoint.date).format("MMMM D");
    //   const lastValue = ((100 * lastPoint.positive) / lastPoint.total).toFixed(
    //     0
    //   );
    //   const isNotMet = testsData.some(d => d.positive / d.total > 0.15);
    //   summaries.push(`This criteria ${isNotMet ? "is not" : "is"} being met.`);
    //   summaries.push(
    //     `On ${lastDate}, the positive test rate is ${lastValue}%.`
    //   );
    // } else if (analysis === "hospitalCapacity") {
    //   const hospitalData = ((data as any) as HospitalData[])
    //     .filter(e => !e.incomplete)
    //     .slice(-14);
    //   const lastPoint = hospitalData[hospitalData.length - 1];
    //   const lastDate = moment(lastPoint.date).format("MMMM D");
    //   const vent = Math.round(
    //     (100 * lastPoint.ventilatorsAvail) / lastPoint.ventilatorsCapacity
    //   );
    //   const icu = Math.round(
    //     (100 * lastPoint.criticalCareAvail) / lastPoint.criticalCareCapacity
    //   );
    //   const inpatient = Math.round(
    //     (100 * lastPoint.inpatientCareAvail) / lastPoint.inpatientCareCap
    //   );
    //   const over = [];
    //   if (vent > 75) over.push("ventilator");
    //   if (icu > 75) over.push("ICU bed");
    //   if (inpatient > 75) over.push("inpatient bed");
    //   if (over.length === 0) {
    //     summaries.push(
    //       "This criteria is being met. Ventilator, ICU bed, and inpatient bed capacity are below 75% full."
    //     );
    //   } else {
    //     // TODO: make this a reusable function
    //     const tobe = over.length > 1 ? "are" : "is";
    //     const last = over.pop();
    //     const rest = over.join(", ");
    //     const list = `${rest}${rest ? " and " : ""}${last}`;
    //     summaries.push(
    //       `This criteria is not being met. The ${list} capacity ${tobe} more than 75% full.`
    //     );
    //   }
    //   summaries.push(
    //     `On ${lastDate}, the ventilator capacity is ${vent}%, the ICU bed capacity is ${icu}%, and the inpatient bed capacity is ${inpatient}%.`
    //   );
    // }
  }

  return (
    <div className="c19-sr-criteria-graph">
      <h4 className="c19-sr-criteria-graph__title">{title}</h4>
      {imageOverride ? (
        <div>
          <img
            src={`${process.env.PUBLIC_URL}/${imageOverride.src}`}
            alt={imageOverride.alt}
            className="c19-sr-criteria-graph__override-image"
          />
          {imageOverride.caption && <p>{imageOverride.caption}</p>}
        </div>
      ) : (
        <DataDisplayComponent
          type={type}
          titleOverride={titleOverride}
          data={data.data}
          dataSources={data.dataSources}
          stateName={stateName}
          updateFips={updateFips}
        >
          {/* {summaries.length > 0 && (
            <div className="c19-sr-criteria-graph-details">
              <h5 className="c19-sr-criteria-graph-details__title">Summary</h5>
              <ul className="c19-sr-criteria-graph-details__list">
                {summaries.map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            </div>
          )} */}
          {details && details.length > 0 && (
            <div className="c19-sr-criteria-graph-details">
              <h5 className="c19-sr-criteria-graph-details__title">Details</h5>
              <ul className="c19-sr-criteria-graph-details__list">
                {details.map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            </div>
          )}
        </DataDisplayComponent>
      )}
      {data.dataSources && data.dataSources.length > 0 && (
        <div className="c19-sr-criteria-graph-source">
          <h5 className="c19-sr-criteria-graph-source__title">Source</h5>
          <ul className="c19-sr-criteria-graph-source__list">
            {data.dataSources.map(({ name, link }, i) =>
              link && link.length ? (
                <li key={i}>
                  <a href={link}>{name}</a>
                </li>
              ) : (
                <li key={i}>{name}</li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
interface CriteriaDetailProps {
  criteria: CriteriaDetail | CriteriaDetail[];
  criteriaNumber: number;
  subCriteriaNumber?: string;
  stateName: string;
  covidStats: CovidStats;
  updateFips: (fips: string) => void;
}

const CriteriaDetailElement: React.FunctionComponent<CriteriaDetailProps> = ({
  criteria,
  criteriaNumber,
  subCriteriaNumber,
  stateName,
  covidStats,
  updateFips
}) => {
  if (Array.isArray(criteria)) {
    const subCriteria = criteria.map((c, i) => {
      //  just in case we have more... we can evolve to as switch ;)
      const subCriteriaNumber = "AB"[i];
      return (
        <CriteriaDetailElement
          key={i}
          covidStats={covidStats}
          stateName={stateName}
          criteria={c}
          criteriaNumber={criteriaNumber}
          subCriteriaNumber={subCriteriaNumber}
          updateFips={updateFips}
        ></CriteriaDetailElement>
      );
    });
    return <>{subCriteria}</>;
  }
  const {
    criteriaName,
    criteriaDetails,
    met,
    dataSource,
    dataViews
  } = criteria;
  const data = covidStats.dataSets[dataSource];
  const updatedAt = data?.updatedDate;
  const dataSources = data?.dataSources;
  const dataSeries = data?.data;
  const notMetExplanation = data?.notMetExplanation || "";
  const notMetTitle = data?.notMetTitle || "";
  let daysMetBox = null;

  // Do not display no data or datasources
  if (!data || !dataSources) {
    // TODO: Return more detail
    return null;
  }

  const dataViewComponents = dataViews.map((dv, i) => {
    let dataOverride = data;
    let dataSourceOverride = dataSources;
    if (dv.dataSource) {
      const localData = covidStats.dataSets[dv.dataSource];
      if (typeof localData === "undefined") {
        return null;
      }
      dataOverride = localData || data;
      // dataSourceOverride =
      //   covidStats.dataSets[dv.dataSource]?.dataSources || dataSources;
    }
    return (
      <DataDisplay
        key={i}
        imageOverride={dv.imageOverride}
        type={dv.type}
        titleOverride={dv.titleOverride}
        details={dv.details}
        data={dataOverride}
        stateName={stateName}
        updateFips={updateFips}
      />
    );
  });

  if (
    Array.isArray(dataSeries) &&
    dataSeries[0] &&
    ("daysMet" in (dataSeries[0] as SplineData) ||
      "positivityDaysMet" in (dataSeries[0] as SplineData))
  ) {
    let tempDaysMet = (dataSeries as any).map(
      (e: {
        daysMet?: number;
        positivityDaysMet?: number;
        positivityStatus?: string;
        status?: string;
        positivityIncomplete?: boolean;
        incomplete?: boolean;
      }) => ({
        daysMet: e.positivityDaysMet || e.daysMet,
        status: e.positivityStatus || e.status,
        incomplete: e.positivityIncomplete || e.incomplete
      })
    );

    daysMetBox = (
      <ProgressDisplay
        met={met}
        data={(tempDaysMet as unknown) as SplineData[]}
        notMetExplanation={notMetExplanation}
        notMetTitle={notMetTitle}
      />
    );
  }
  const titleClassNames = ["c19-sr-criteria__title"];

  if (met) {
    titleClassNames.push("is-met");
  } else {
    titleClassNames.push("is-not-met");
  }

  const updateAtEl = updatedAt ? (
    <p className="c19-sr-criteria__updated-at">
      Updated {moment(updatedAt).format("MMMM DD, YYYY")}
    </p>
  ) : null;

  const titleCriteriaMet = met
    ? "Criteria was met on"
    : "Criteria has not been met";

  return (
    <div
      className="c19-sr-criteria"
      id={`criteria-${criteriaNumber}${
        subCriteriaNumber ? subCriteriaNumber : ""
      }`}
    >
      <h3 className="c19-sr-criteria__criteria-desc measure-2">
        <span>
          Criteria {criteriaNumber}
          {subCriteriaNumber}{" "}
        </span>
        <br />
        {criteriaName}
      </h3>
      {updateAtEl}
      <p>{criteriaDetails}.</p>
      {criteriaNumber == 5 ? null : daysMetBox}
      {dataViewComponents}
    </div>
  );
};

export default CriteriaDetailElement;
