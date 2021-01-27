const fs = require("fs");
const path = require("path");
const topoJson = require("topojson-client");
const counties = require("./countiesData.json");
const states = require("./usaData.json");

const gaCounties = counties.filter(e => e.id.slice(0, 2) === "13");
const fipsToCounty = gaCounties.reduce((acc, e) => {
  return { ...acc, [e.id]: e.properties.name.toLowerCase() };
});

const countyToFips = gaCounties.reduce((acc, e) => {
  return { ...acc, [e.properties.name.toLowerCase()]: e.id };
});
const gaState = topoJson
  .feature(states, states.objects.states)
  .features.filter(d => d.id == "13");

fs.writeFileSync(
  path.join(__dirname, "ga", "geoCounties.json"),
  JSON.stringify(gaCounties)
);
fs.writeFileSync(
  path.join(__dirname, "ga", "geoState.json"),
  JSON.stringify(gaState)
);
fs.writeFileSync(
  path.join(__dirname, "ga", "fipsToCounty.json"),
  JSON.stringify(fipsToCounty)
);
fs.writeFileSync(
  path.join(__dirname, "ga", "countyToFips.json"),
  JSON.stringify(countyToFips)
);
