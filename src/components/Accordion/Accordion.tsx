import React, { useState } from "react";
import classnames from "classnames";
import { useUniqueId } from "utils/useUniqueId";

interface Props {
  title: React.ReactNode;
  addClass?: string;
  open?: boolean;
}

const Accordion: React.FC<Props> = props => {
  const [isExpanded, setIsExpanded] = useState(props.open || false);
  const controlId = useUniqueId("accordion");

  return (
    <div
      className={classnames("usa-accordion c19-sr-accordion", props.addClass)}
    >
      <h2 className="usa-accordion__heading">
        <button
          type="button"
          className="usa-accordion__button c19-sr-accordion__button"
          aria-expanded={isExpanded}
          aria-controls={controlId}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/*<span className="c19-sr-accordion__icon">I</span>*/}
          <span className="c19-sr-accordion__title">{props.title}</span>
        </button>
      </h2>
      <div
        id={controlId}
        className="usa-accordion__content usa-prose c19-sr-accordion__content"
        hidden={!isExpanded}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Accordion;
