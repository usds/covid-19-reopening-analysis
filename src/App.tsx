import React, { useState } from "react";
import { ApiContainer } from "components/ApiContainer";
import { ReportDetails } from "types/report";

import UpdateHistoryLink from "components/UpdateHistoryLink";
import ReopeningStatus from "components/ReopeningStatus";
import CDCGuidelines from "components/CDCGuidlines/CDCGuidelines";
import CriteriaDetail from "components/CriteriaDetail/CriteriaDetail";
import Footer from "components/Footer/Footer";

import "./App.scss";

const defaultFips = process.env.REACT_APP_BASE_FIPS || ""; // Georgia
const starting = {
  stateFips: "",
  stateName: "",
  reopenStatus: "",
  statusBody: [],
  phaseDetails: [],
  whatDoesThisMean: {},
  currentPhase: 0,
  lastUpdated: 0
};
function App() {
  // For use when we load data via ajax
  //const [isLoading, setIsLoading] = useState(true);
  //const [reportFips, setReportFips] = useState(defaultFips);
  const [reportFips, setFips] = useState<string>(defaultFips);

  const [reportData, setReportData] = useState<ReportDetails>(starting);

  const {
    stateName,
    reopenStatus,
    statusBody,
    lastUpdated,
    currentPhase,
    phaseDetails,
    whatDoesThisMean,
    covidStats,
    phaseTwoStartDate,
    phaseThreeStartDate
  } = reportData; //state

  // Mayber there's a better way to do this? Will vizualizations be the same across phase 1,2,3??
  // Yes... originally I think we were developing a more generalized tool -

  const phaseCriteriaDetails = phaseDetails.map((c, i) => {
    if (!covidStats) return null;
    return (
      <CriteriaDetail
        key={i}
        criteria={c}
        criteriaNumber={i + 1}
        stateName={stateName}
        covidStats={covidStats}
        updateFips={setFips}
      ></CriteriaDetail>
    );
  });
  let CDCGuidelinesEl = null;
  if (typeof covidStats != "undefined") {
    CDCGuidelinesEl = (
      <CDCGuidelines
        currentPhase={currentPhase}
        phaseDetails={phaseDetails}
        whatDoesThisMean={whatDoesThisMean}
        phaseTwoStartDate={phaseTwoStartDate}
        phaseThreeStartDate={phaseThreeStartDate}
      ></CDCGuidelines>
    );
  }
  // TODO: Chooser to change from state to county
  // <select onChange={setDataUrl(e.target.value)>...</select>

  return (
    <ApiContainer fips={reportFips} setReportData={setReportData}>
      <div id="main-wrapper">
        <main
          id="main-content"
          role="main"
          className="usa-layout-docs c19-sr__main"
        >
          <div className="grid-container">
            <UpdateHistoryLink updatedAt={lastUpdated}></UpdateHistoryLink>
            <ReopeningStatus
              reopenStatus={reopenStatus}
              statusBody={statusBody}
              stateName={stateName}
              updatedAt={lastUpdated}
            ></ReopeningStatus>
            <hr />
            {CDCGuidelinesEl}
            <hr />
            <h2 id="supporting-data">Supporting Data</h2>
            <p id="supporting-data-about">
              Data from the previous three days is volatile and usually
              incomplete, and therefore is not included in these graphs. Every
              day, we collect and review incoming data for accuracy to avoid
              releasing misleading or damaging information. In each graph this
              period of time is represented with a gray shaded box.
            </p>
            {/* <CountyCaseMap county="13000" data={countyGeoCaseData} counties={/> */}
            {phaseCriteriaDetails}
          </div>
        </main>
        <Footer title="foo" />
      </div>
    </ApiContainer>
  );
}

export default App;
