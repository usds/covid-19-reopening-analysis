import React from "react";

import { CountyMap } from "../components/Maps/CountyMap";

export default {
  title: "Map",
  component: CountyMap
};
const counties = {
  13049: { class: "increasing" }
};
export const TestingMap = () => <CountyMap counties={counties} />;
//  <AppStoreProvider
// initialState={{
//   covidTimeSeries: mockCovidTimeSeries,
//   selection: {
//     date: "2020-3-15",
//     state: "1",
//     county: "1|1",
//     metric: "confirmed"
//   },
//   mapView: { width: 400, height: 600, latitude: 40.8136, longitude:-99.0762, zoom: 2 }
// }}
// >
// </AppStoreProvider>;
