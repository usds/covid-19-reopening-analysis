// import React from "react";
// import ProgressDisplay from "components/ProgressDisplay/ProgressDisplay";
// import moment from "moment";
// import { SplineData } from "types/report";

// export default { title: "ProgressDisplay" };

// // We only care about incomplete and daysMet
// // So no need to fill the actual data points here
// const dayRun = (...runs: number[]) => {
//   let state = false;
//   let list: SplineData[] = [];
//   const cd = moment("2020-04-30");
//   for (const run of runs) {
//     list.push(
//       ...Array(run)
//         .fill(state)
//         .map((e, i) => ({
//           date: cd.add(1, "day").valueOf(),
//           count: 0,
//           spline: 0,
//           analysis: "",
//           criteriaMet: e,
//           daysMet: e ? i + 1 : 0,
//           incomplete: false
//         }))
//     );
//     state = !state;
//   }
//   list.push(
//     ...Array(3)
//       .fill(0)
//       .map(_ => ({
//         incomplete: true,
//         criteriaMet: false,
//         date: cd.add(1, "day").valueOf(),
//         count: 0,
//         spline: 0,
//         analysis: "",
//         daysMet: 0
//       }))
//   );

//   return list;
// };

// export const ShortAllGood = () => (
//   <ProgressDisplay met={true} data={dayRun(0, 7)} />
// );

// export const ShortAllBad = () => (
//   <ProgressDisplay met={true} data={dayRun(16)} />
// );

// export const ShortBadGood = () => (
//   <ProgressDisplay met={true} data={dayRun(5, 12)} />
// );

// export const ShortGoodBad = () => (
//   <ProgressDisplay met={true} data={dayRun(0, 13, 5)} />
// );

// export const RecentReset = () => (
//   <ProgressDisplay met={true} data={dayRun(2, 15, 9, 6)} />
// );

// export const TwoResets = () => (
//   <ProgressDisplay met={true} data={dayRun(7, 10, 7, 8, 5, 4)} />
// );

// export const JustMet = () => (
//   <ProgressDisplay met={true} data={dayRun(0, 14)} />
// );

// export const EasilyMet = () => (
//   <ProgressDisplay met={true} data={dayRun(0, 20)} />
// );

// export const JustUnmet = () => (
//   <ProgressDisplay met={true} data={dayRun(1, 13)} />
// );

// export const Bouncy = () => (
//   <ProgressDisplay met={true} data={dayRun(1, 4, 3, 3, 5, 2, 3, 9)} />
// );

// // Shouldn't happen because of the 3-day spline averaging.
// export const MostlyIncreasing = () => (
//   <ProgressDisplay
//     met={true}
//     data={dayRun(3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1)}
//   />
// );

// export const GrowthThenDecline = () => (
//   <ProgressDisplay met={true} data={dayRun(7, 13)} />
// );

// export const MoreBouncing = () => (
//   <ProgressDisplay met={true} data={dayRun(5, 1, 5, 1, 3)} />
// );

// // Decrease is a negative slope of the spline of a 3-day average would meet the criteria of downward trajectory. Not applied to actual case counts, just the spline.
// // 2 days following the 6 days
// // Need to know what happened prior to the initial 2 days to see if it is a part of the grace period.
// export const Phase1Scenario1 = () => (
//   <ProgressDisplay met={true} data={dayRun(2, 6, 2, 3)} />
// );

// // 2 days would be a grace period. This would be met.
// // Should always look back, even if there was a transition change.
// export const Phase1Scenario2 = () => (
//   <ProgressDisplay met={true} data={dayRun(2, 12)} />
// );

// export const Phase1Scenario3 = () => (
//   <ProgressDisplay met={true} data={dayRun(5, 9)} />
// );

// // 17 days shown
// // Not met. There needs to be 6 days of decline following a rebound
// // which doesn't happen here.
// export const Phase1Scenario4 = () => (
//   <ProgressDisplay met={true} data={dayRun(5, 4, 2, 6)} />
// );

// // We use 5 days for cases, rebound or growth following 14 days of downward trajectory
// // 5th day is a rebound
// // Following rebound or growth, you need to have 6 days of a negative slope to met criteria for sustained decline
// // 6 days don't have a grace period, wouldn't be 6 days of negative slope
// // 6 days then an additional 8 days with 5-day grace period built in
// export const Phase1Scenario5 = () => (
//   <ProgressDisplay met={true} data={dayRun(2, 14, 5)} />
// );

// // First 6 days have to be decreasing to establish a sustained decline. No grace period for 6 days after a rebound.
// export const Phase1Scenario6 = () => (
//   <ProgressDisplay met={true} data={dayRun(2, 14, 6, 6)} />
// );

// export const GracePeriodScenario = () => (
//   <ProgressDisplay met={true} data={dayRun(3, 12, 9)} />
// );
