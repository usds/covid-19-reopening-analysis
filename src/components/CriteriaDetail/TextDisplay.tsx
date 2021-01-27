import React from "react";
import classnames from "classnames";

interface Props {
  statusText: string;
  statusClass: string;
}
export const TextDisplay: React.FC<Props> = props => {
  return (
    <>
      <h3 className={classnames("c19-sr-criteria-static", props.statusClass)}>
        {props.statusText}
      </h3>
      {props.children}
    </>
  );
};
