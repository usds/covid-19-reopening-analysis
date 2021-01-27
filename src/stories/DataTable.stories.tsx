import React from "react";
import DataTable from "components/DataTable/DataTable";
import moment from "moment";

export default { title: "DataTable" };

const dateFormatter = (date?: number) =>
  date ? moment(date).format("MMMM D") : "";

const fields = [
  { key: "", title: "Phase Day", format: (_: any, i: number) => String(i + 1) },
  { key: "date", title: "Date", format: dateFormatter },
  { key: "happy", title: "Happy" },
  { key: "sad", title: "Sad" },
  { key: "mood", title: "Mood" }
];

const day = moment("2020-05-28");

const data = [
  {
    date: day.add(1, "day").valueOf(),
    happy: 2142.4999,
    sad: 99.6999991,
    mood: "tense"
  },
  {
    date: day.add(1, "day").valueOf(),
    happy: 867.5309,
    sad: -0.68544,
    mood: "hopeful"
  },
  {
    date: day.add(1, "day").valueOf(),
    happy: 999.47,
    sad: -49.68544,
    mood: "hopeful"
  },
  {
    date: day.add(1, "day").valueOf(),
    happy: 41.492,
    sad: 15.642,
    mood: "optimistic"
  },
  {
    date: day.add(1, "day").valueOf(),
    happy: 1957.00000158232,
    sad: 98.60000003,
    mood: "bitter"
  },
  {
    date: day.add(1, "day").valueOf(),
    happy: -0.0345287,
    sad: 0.006439,
    mood: "wistful"
  },
  {
    date: day.add(1, "day").valueOf(),
    happy: 8.241284e12,
    sad: 7.3023423,
    mood: "ditzy"
  }
];

export const BasicTable = () => <DataTable fields={fields} data={data} />;

export const OnlyScreenReader = () => (
  <DataTable
    className="usa-sr-only"
    caption="Happy versus Sad (with className .usa-sr-only)"
    fields={fields}
    data={data}
  />
);
