import React from "react";
import { PhaseGuidelines } from "./PhaseGuidelines";
import { CriteriaDetail } from "types/report";

interface CDCGuidelinesProps {
  currentPhase: number;
  whatDoesThisMean: {
    phaseOne?: { text: string; link?: string }[];
    phaseTwo?: { text: string; link?: string }[];
    phaseThree?: { text: string; link?: string }[];
  };
  phaseDetails: (CriteriaDetail | CriteriaDetail[])[];
  phaseTwoStartDate?: string;
  phaseThreeStartDate?: string;
}

const CDCGuidelines: React.FunctionComponent<CDCGuidelinesProps> = props => {
  const {
    currentPhase,
    phaseDetails,
    whatDoesThisMean,
    phaseTwoStartDate,
    phaseThreeStartDate
  } = props;

  return (
    <div className="c19-sr-guidelines grid-row">
      <div className="grid-col-12">
        <h2 className="c19-sr-guidelines__title">
          CDC guidelines for reopening
        </h2>
        <p className="c19-sr-guidelines__desc">
          <a href="https://www.whitehouse.gov/openingamerica/">
            Federal guidelines
          </a>{" "}
          have defined 3 phases that detail the responsibilities of individuals
          and employers during all phases, and in each specific phase of the
          reopening of America. The phased approach can be implemented statewide
          or community-by-community at governors' discretion.
        </p>
        <p className="c19-sr-guidelines__desc">
          The guidelines propose the use of{" "}
          <a href="https://www.cdc.gov/coronavirus/2019-ncov/downloads/php/CDC-Activities-Initiatives-for-COVID-19-Response.pdf">
            six “gating” indicators
          </a>{" "}
          to assess when to move through from one mitigation phase to another.
          To understand when it's safe to reopen, communities should use not
          only these gating criteria, but also contextual information about
          healthcare capacity, additional epidemiological metrics, and the
          impact of reopening on other communities.
        </p>
      </div>
      <div className="c19-sr-phases">
        <PhaseGuidelines
          phaseTwoStartDate={phaseTwoStartDate}
          phaseMet={currentPhase === 1}
          currentPhase={currentPhase}
          phaseNum={1}
          phaseDetails={phaseDetails}
          whatDoesThisMean={whatDoesThisMean.phaseOne}
        ></PhaseGuidelines>
        <PhaseGuidelines
          phaseThreeStartDate={phaseThreeStartDate}
          phaseMet={currentPhase === 2}
          currentPhase={currentPhase}
          phaseNum={2}
          phaseDetails={phaseDetails}
          whatDoesThisMean={whatDoesThisMean.phaseTwo}
        ></PhaseGuidelines>
        <PhaseGuidelines
          phaseMet={currentPhase === 3}
          currentPhase={currentPhase}
          phaseNum={3}
          phaseDetails={phaseDetails}
          whatDoesThisMean={whatDoesThisMean.phaseThree}
        ></PhaseGuidelines>
      </div>
    </div>
  );
};

export default CDCGuidelines;
