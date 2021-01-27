const fs = require("fs");
const path = require("path");
const topoJson = require("topojson-client");
const counties = require("./countiesData.json");
const states = require("./usaData.json");

function createGeoJSONFiles(stateFips) {
  const filteredCounties = counties.filter(e => e.id.slice(0, 2) == stateFips);

  const filteredState = topoJson
    .feature(states, states.objects.states)
    .features.filter(d => d.id == stateFips);

  fs.writeFileSync(
    path.join(__dirname, "geo", `${stateFips}000_counties.json`),
    JSON.stringify(filteredCounties)
  );
  fs.writeFileSync(
    path.join(__dirname, "geo", `${stateFips}000_state.json`),
    JSON.stringify(filteredState)
  );
}
// Create geojson for each of the following fips code.
createGeoJSONFiles(##);
