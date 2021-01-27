import React from "react";

interface ReopeningStatusProps {
  reopenStatus: string;
  statusBody: string[];
  stateName: string;
  updatedAt: number;
}
const ReopeningStatus: React.FC<ReopeningStatusProps> = props => {
  const { reopenStatus, statusBody, stateName } = props;

  const bodyItems = statusBody.map((body, i) => (
    <p className={`c19-sr-reopening-status__para${i + 1}`} key={i}>
      {body}
    </p>
  ));

  return (
    <div className="c19-sr-reopening-status">
      <h1 className="c19-sr-reopening-status__title">
        {stateName} coronavirus reopening status
      </h1>
      <div className="usa-alert usa-alert--warning c19-sr-reopening-status__alert">
        <div className="usa-alert__body">
          <h2 className="c19-sr-reopening-status__sub-title usa-alert__heading">{reopenStatus}</h2>
          <ul className="c19-sr-reopening-status__list">
            <li className="c19-sr-reopening-status__item">
              Continue to regularly wash your hands
            </li>
            <li className="c19-sr-reopening-status__item">
              Continue to practice physical distancing, stay six feet away from
              others
            </li>
            <li className="c19-sr-reopening-status__item">
              Wear a protective face covering if you leave your home and are in a place where you cannot practice physical distancing
            </li>
            <li className="c19-sr-reopening-status__item">
              Stay home if you are sick, except to get medical care
            </li>
            <li className="c19-sr-reopening-status__item">
              For more guidance,{" "}
              <a href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">
                visit the CDC coronavirus web site
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="grid-col-12">{bodyItems}</div>
    </div>
  );
};
export default ReopeningStatus;
