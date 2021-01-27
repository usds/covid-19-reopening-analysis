import { generateReports } from "../util/report";

const dataSources = {
  ili: [
    {
      name: "CDC",
      link: "https://www.cdc.gov"
    }
  ],
  cli: [
    {
      name: "CDC",
      link: "https://www.cdc.gov"
    }
  ],
  confirmedCases: [
    {
      name: "CDC",
      link: "https://www.cdc.gov"
    }
  ],
  tests: [
    {
      name: "CDC",
      link: "https://www.cdc.gov"
    }
  ],
  testingProgram: [
    {
      name: "CDC",
      link: "https://www.cdc.gov"
    }
  ],
  hospitalCapacity: [
    {
      name: "CDC",
      link: "https://www.cdc.gov"
    }
  ]
};
const FIPS = "00000";
const PHASE = 3;
generateReports(dataSources, FIPS, PHASE);
