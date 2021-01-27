# Covid 19 Transparency Architecture Overview

The project is broken into two pieces:

- The [frontend](#frontend) in react that will digest JSON generated on a regular schedule from the analysis code
- The [analysis toolkit](#analysis-toolkit) that will generate the stats/analysis that can be consumed by the front end.
  - The analysis files can be used for any system, not just the frontend as provided.

We do not provide any sort of content management system backend since all users
would likely already have some sort of CMS. At its simplest, you only need to
build the react app once to insert into youre page, and then you can host the
generated data on any site that they have - our initial partners had an
existing infrastructure that guided our process.

With some more effort you can be building the site everyday and serve server
rendered data for the first load, while allowing users to navigate to other
localities dynamically.

## Frontend

The front end was built to accomodate a variety of scenarios, but
everything is driven by the `public/<fips>_status.json` and the
[`public/covidstats/<fips>.json`](#covid-stats) files, where the status file
determines the structure and the covidstats file drives the content.

The most important part of the status file is the [phaseDetails](#phase-details),
which drives all the substance of the report.

### Phase Details

The `phaseDetails` property of the `<fips>_status.json` file is what determines
what each indicator in a given phase is. It was designed to allow for localities
to add additional indicators as needed.

The phaseDetails is an array of either "criteria details" or a nested array of
"criteria details," where the "criteria element" takes the form of:

```ts
{
  criteriaName: string;
  criteriaDetails: string;
  dataSource: DataType;
  dataViews: DataView[];
  met?: boolean;
  daysMet?: boolean[];
}
```

##### Property definitons:

- criteriaName
  - The name of the criteria/indicator
- criteriaDetails:
  - Description of the criteria/indicator
- [dataSource](#datasource):
  - The primary datasource that drives this indicator. This datasource will
    determine the met/not-met value of this indicator.
- [dataViews](#dataviews):
  - An array of "dataViews" that will determine what type of visualizations will
    be displayed
- met:
  - Hard override of whether or not an element has been met. The intention here
    is for when an epidemiologist disagrees that a status has been met.

#### dataSource

All data is pulled from the different [covid stats](#covid-stats) files. This is
a string that is the name of one of the properties in the `covidStats` file.

This is what will determine the met/not-met status of the criteria/indicator, as
well as the reason for it's status. It will also be the default datasource for
any dataviews.

#### dataViews

Data views are the different display items that will justify and explain to the
public the met/not-met status of each indicator.

They take the form of:

```ts
{
  type: DataViewType;
  titleOverride?: string;
  dataSource?: DataType;
  details?: string[];
  imageOverride?: {
    src: string;
    alt: string;
    caption?: string;
};
```

##### Property definitons:

- type
  - The type of dataview that this is, i.e. the name of the element that will
    render this data
- titleOverride
  - an override for if the default dataview title is not sufficient
- dataSource:
  - an override for only this dataview, this will not change the met/not-met
    status of the parent criteria/indicator
- details
  - Descirptions that can provide additional context about this criteria.
    This is used for the epidemiologists to provide context about this specific
    measurement. Must be an array of strings.
- imageOverride
  - If there needs to be an image override for whatever reason. This will result
    in not rendering the default charts/graphs

### Covid Stats

The covid stats files are locality specific files that have all the information
about the different criteria/indicators and supporting information that is needed.

The `dataSets` all have the following properties:

```ts
{
  dataSources?: DataSources[];
  dataValidThrough?: number;
  updatedDate?: number;
  met?: boolean;
  notMetExplanation?: string;
  notMetTitle?: string;
  data: ----
}
```

##### Property definitons:

- dataSources
  - Provided during report generation, this indicates _where_ the data is
    coming from so the public can trace the information
- dataValidThrouh:
  - This indicates the last valid date in the dataset, this is important as some
    datasets have adjusting periods of up to 5 days, and we do not want to show
    inaccurate data, even if we have datapoints for that day.
- updateData
  - This indicates the last day that this dataset was updated.
- met
  - self-explanatory
- notMetExplanation
  - an explanation that provides the reasons why a criteria/indicator was
    met/not met
- notMetTitle
  - the title of said explanation
- data
  - the actual dataset. This is usually a timeseries, but it can take any form
    necessary. (most notably, it should take another form for map data)

## Analysis Toolkit

The analysis toolkit is a set of R scripts and TS code that is used to generate
the covidstats files.

Each locality will need to properly format their data for consumption. Example
implementations are in the `toolkit/reference_locality` directory.

The `ref_analysis.R` must call the following `functions` with the correct columns.
All re-mapping should be done in the locality specific R file, while the writing
and processing of the data should be done in the trajectory_analysis_usds.R file.

- `writeCasesStateSpline`:
  - `date` - Rscript date
  - `pop` - population of state on every row
  - `count` - daily count as N > 0
- `writeCasesCountySpline`
  - `date`
  - `pop`
  - `count`
  - `fips` - locality identifier (i.e. 5 digit fips code)
- `writeSyndromicStateSpline`
  - `date`
  - `cli` - cli daily count
  - `ili` - ili daily count
- `writeSyndromicCountySpline`
  - `date`
  - `cli` - cli daily count
  - `ili` - ili daily count
  - `fips` - locality identifier (i.e. 5 digit fips code)
- `writePositivityStateSpline`
  - `date`
  - `pop`
  - `percent_positive` - percent of positive tests for that day
  - `total` - total number of tests for that day
- `writeHospitalSpline`
  - `date`
  - `c19_inpatient_burden` - covid19-inpatient-beds/total-staffed-beds
  - `hospital_count` - total number of hospitals
  - `hospitals_missing_ppe_data` - total number of hospitals not reporting ppe data
  - `percent_hospitals_reporting_insufficient_ppe` - daily, missing hospitals count as insufficient
  - `percent_hospitals_reporting_staffShortage` - daily
  - `icu_occupancy_percentage` - icu occupancy percentage

The trajectory_analysis_usds.R file will write temporary files that will be used
by the toolkit's typescript codebase in order to generate json files that are
named according to their fips information and contain json with the following
shape:

```ts
{
  version: string,
  fips:string,
  dataSets:{
    confirmedCases:confirmedCasesDataSetValues,
    cli: cliDataSetValues,
    ili: iliDataSetValues,
    positivity: positivityDataSetValues,
    hospitalCapacity: hospitalDataSetValues
    countyData:countyDataSetValues
    }
  }
}
```

These are all defined in `src/types/report.ts`.
