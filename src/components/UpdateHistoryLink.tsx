import React from "react";
import moment from "moment";

interface UpdateHistoryProps {
  // updates: {
  //   date:string,
  //   updates?:string[]
  // }[]
  updatedAt: number;
}

const UpdateHistoryLink: React.FunctionComponent<UpdateHistoryProps> = ({
  updatedAt
}) => {
  // const mostRecent = updates.map(d=>moment(d.date).format('MMMM Do YYYY, h:mm'));
  return (
    <div className="c19-sr-update">
      <p>DRAFT - PRE-DECISIONAL</p>
      Page last updated at {moment(updatedAt).format("MM/DD/YYYY")},{" "}
      <a className="c19-sr-update__link" href="#supporting-data-about">
        showing data up to{" "}
        {moment(updatedAt)
          .subtract(3, "days")
          .format("MM/DD/YYYY")}
      </a>
    </div>
  );
};

export default UpdateHistoryLink;
