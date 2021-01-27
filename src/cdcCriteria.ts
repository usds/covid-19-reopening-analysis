import moment from "moment";

function cdcPhaseOne() {
  return [3, 3, 3, 5, 6, 19, 10, 3, 4];
}
function cdcPhaseTwo() {
  return [0, 0, 3, 0, 0, 19, 10, 0, 4];
}

function iliSymptoms() {
  const reportDate = "5-11-20";
  // const reportDetails

  const gracePeriod = 3;
  let daysMet = 0;

  const reportDetails = {
    countyOne: [
      { date: "05-11-20", count: 6 },
      { date: "05-10-20", count: 10 },
      { date: "05-9-20", count: 12 },
      { date: "05-8-20", count: 13 },
      { date: "05-7-20", count: 11 },
      { date: "05-6-20", count: 15 },
      { date: "05-5-20", count: 17 },
      { date: "05-4-20", count: 13 },
      { date: "05-3-20", count: 17 },
      { date: "05-2-20", count: 17 },
      { date: "05-1-20", count: 18 },
      { date: "04-30-20", count: 19 },
      { date: "04-28-20", count: 20 },
      { date: "04-27-20", count: 20 },
      { date: "04-26-20", count: 20 },
      { date: "04-25-20", count: 20 }
    ]
  };

  for (let i = 0; i < 14; i++) {}
}
