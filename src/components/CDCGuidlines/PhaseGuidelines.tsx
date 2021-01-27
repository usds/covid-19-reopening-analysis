import React from "react";
import classNames from "classnames";
import { CriteriaDetail } from "types/report";
import Accordion from "../Accordion/Accordion";

interface PhaseCriteriaDetail extends CriteriaDetail {
  phaseNum?: number;
}
interface PhaseCriteriaProps {
  details: PhaseCriteriaDetail | PhaseCriteriaDetail[];
  phaseNum: number;
  criteriaNum: string;
  subCritNum: string;
}
const PhaseCriteria: React.FC<PhaseCriteriaProps> = props => {
  const { details, phaseNum, criteriaNum, subCritNum } = props;
  let met = false;

  if (Array.isArray(details)) {
    const subItems = details.map((detail: CriteriaDetail, i) => {
      if (detail.met) {
        met = true;
      }
      return (
        <PhaseCriteria
          key={`criteria-${i}`}
          criteriaNum={criteriaNum}
          subCritNum={"ABC"[i]}
          details={detail}
          phaseNum={phaseNum}
        />
      );
    });

    let innerItemClass = classNames({
      "c19-sr-phase__item": true,
      "is-met": met,
      "is-not-met": !met
    });

    return (
      <li className={innerItemClass} key={`phase-{$phaseNum}`}>
        <strong>
          {criteriaNum}. Documented cases <em>OR</em> testing
        </strong>
        <br />
        <ol className="c19-sr-phase__sub-list" type="a">
          {subItems}
        </ol>
      </li>
    );
  } else {
    met = details.met;
  }

  let itemClass = classNames({
    "c19-sr-phase__item": true,
    "is-met": met,
    "is-not-met": !met
  });

  return (
    <li className={itemClass}>
      <a
        href={`#criteria-${criteriaNum}${subCritNum ? subCritNum : ""}`}
        className="c19-sr-phase__link"
      >
        {`${subCritNum ? subCritNum : criteriaNum}`}. {details.criteriaName}
      </a>
      {details.criteriaDetails}
    </li>
  );
};

interface PhaseGuidelinesProps {
  phaseNum: number;
  phaseMet: boolean;
  whatDoesThisMean?: { text: string; link?: string }[];
  phaseDetails: (CriteriaDetail | CriteriaDetail[])[];
  currentPhase: number;
  phaseTwoStartDate?: string;
  phaseThreeStartDate?: string;
}
export const PhaseGuidelines: React.FC<PhaseGuidelinesProps> = ({
  phaseDetails,
  phaseNum,
  whatDoesThisMean,
  currentPhase,
  phaseTwoStartDate,
  phaseThreeStartDate
}) => {
  if (currentPhase > phaseNum) {
    const phaseMetTitle = (
      <>
        <p className="c19-sr-accordion__sub-title">Concluded</p>
        CDC Phase {phaseNum}
      </>
    );
    return (
      <Accordion title={phaseMetTitle}>
        <p>
          <strong>Phase {phaseNum} has concluded</strong>
          <br />
          Phase 1 criteria met retrospectively on April 30th. To move into the
          next phase of reopening the state must now meet the criteria for phase{" "}
          {phaseNum + 1}.
        </p>
      </Accordion>
    );
  }
  // If the current phase is less than the phase num, then display the not-met criteria
  if (currentPhase < phaseNum) {
    const phaseNotMetTitle = (
      <>
        <p className="c19-sr-accordion__sub-title">
          Phase {phaseNum - 1} criteria not met
        </p>
        CDC Phase {phaseNum}
      </>
    );
    return (
      <Accordion title={phaseNotMetTitle}>
        <p>
          <strong>
            Phase {phaseNum - 1} criteria have not currently been met
          </strong>
          <br />
          CDC Phase {phaseNum} requires all criteria from phase {phaseNum - 1}{" "}
          to be continually met for an additional 14 days.
        </p>
      </Accordion>
    );
  }

  // If there are no phase details, then just show the reopening status.
  if (!phaseDetails) {
    return (
      <Accordion title={`Threshold for entering Phase ${phaseNum}`}>
        <p>
          CDC Phase {phaseNum - 1} criteria have not currently been met and thus
          this phase cannot commence.
        </p>
      </Accordion>
    );
  }
  const phaseInProgress = (
    <>
      <p className="c19-sr-accordion__sub-title">Evaluation in-progress</p>
      CDC Phase {phaseNum}
    </>
  );
  return (
    <Accordion title={phaseInProgress} open={true}>
      <ol className="c19-sr-phase__list">
        {phaseDetails.map((detail, i) => (
          <PhaseCriteria
            key={i}
            criteriaNum={`${i + 1}`}
            subCritNum=""
            details={detail}
            phaseNum={phaseNum}
          />
        ))}
      </ol>
      {whatDoesThisMean && (
        <>
          <h4>What does this mean in my state?</h4>
          <ul>
            {whatDoesThisMean.map((item, i) => (
              <li key={i}>
                {item.link ? (
                  <a href={item.link} rel="noopener noreferrer" target="_blank">
                    {item.text}
                  </a>
                ) : (
                  item.text
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </Accordion>
  );
};
