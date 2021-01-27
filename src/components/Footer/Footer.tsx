import React from "react";

interface FooterProps {
  title: string;
}

const Footer: React.FC<FooterProps> = ({ title }) => {
  return (
    <footer className="grid-container">
      <div className="c19-sr-footer">
        <p>
          <strong>Data sources, data quality, and frequency of updates</strong>
        </p>
        <ul>
          <li>
            Assesments of these data follow{" "}
            <a href="https://www.whitehouse.gov/openingamerica/">
              federal guidelines
            </a>{" "}
            and{" "}
            <a href="https://www.cdc.gov/coronavirus/2019-ncov/downloads/php/CDC-Activities-Initiatives-for-COVID-19-Response.pdf">
              related guidance from the Centers for Disease Control and
              Prevention (CDC)
            </a>
            .
          </li>
        </ul>
        <p>
          Due to the nature of the situation, data may be updated at irregular
          intervals and the results of the above assessments are subject to
          change. To determine increasing or decreasing trends, smoothing curves
          (cubic splines) have been applied to specific indicators using{" "}
          <a href="https://www.cdc.gov/coronavirus/2019-ncov/downloads/php/CDC-Activities-Initiatives-for-COVID-19-Response.pdf">
            methods suggested by the CDC
          </a>
          .
        </p>
        <p>
          State or county populations referenced are from 2018 estimates.
          Counties with insufficient data, counties with less than five reported
          coronavirus cases in the past 14 days, or counties that have never
          reported any coronavirus cases may not influence the above
          assessments.
        </p>
        <p>
          For the most up-to-date guidance on COVID-19, visit the{" "}
          <a
            href="https://www.cdc.gov/coronavirus/2019-nCoV/index.html"
            title="CDC coronavirus resources"
          >
            CDC
          </a>{" "}
          coronavirus web sites.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
