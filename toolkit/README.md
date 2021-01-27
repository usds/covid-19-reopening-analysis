# Report Generation Toolkit

The purpose of the toolkit is to generate a report for specific states and geographic regions contained in the state. All county and state identifications should be by the region's FIPS Code standards.

## Quick links

- [About](#about-the-toolkit)
- [Dependencies](#dependencies)
- [Operation](#operation)
- [Seams](#data-seams)
- [Data Processing](#data-processing)
  - [Cases/CLI/ILI/](#cases-ili-cli)
  - [Lab tests](#tests)
- [Report generation](#report-generation)
- [Useful links](#useful-links)
- [Notes](#notes)

## About the toolkit

The expected data we will receive includes:

- CLI
- ILI
- Confirmed Case count
- Hospital
- Lab testing

Of these, _CLI_, _ILI_, _cases_, and _lab tests_ will need to be [processed](#data-processing) with rscript before generating the report, because they require a spline applied to the dataset (and for _cases_ a 3 day rolling average).

## Dependencies:

You will need the [R programming language](https://www.r-project.org/), [Node.js](https://nodejs.org/en/download/), and [Typescript](https://www.typescriptlang.org/index.html#download-links).

The R packages should self-install on the first run of the `trajectory_analysis_USDS.R` file:

- runner
- tidyr
- dplyr
- tibble

Node.js dependencies are in the `package.json` and should be installed as usual:

```
yarn install
```

## Operation

You will need to create a new yarn script that runs the following in order:

1. `yarn toolkit:build` - Clears out all the temporary files and builds the typescript files
2. `rscript ./toolkit/reference_locality/ref_analysis.R` - a custom R file for formatting your data for the `trajectory_analysis_USDS.R` file
3. `node ./toolkit/dist/toolkit/csvToJson` - converts the temporary CSV output to JSON
4. `node ./toolkit/dist/toolkit/reference_locality/refReportGenerator` - calls the report generation scripts
5. `cp ./toolkit/dist/toolkit/_scratch/reports/* ./public/covidstats` - copies the files over

If you are using map data, then you will need to ensure that you have the correct geojson for that. You can generate it for states via the `toolkit/USAGeo/filterCounties.js` file.

## Data Seams

The R scripts will generate intermediate csv files in `toolkit/dist/toolkit/_scratch/` that should have all the mathematical functions or re-mappings, transformations, and fills (e.g. date fills) applied to the data.

From here the csv files are then turned into json files using the `csvToJson.ts` script, which originally allowed for different states to adapt arbitrary data..

From the json files the state specific generators then call the [report script](./report.ts) that generators the final files in the format of `${fips}.json` and places the files in the public folder.

The only state specific things are:

- Datasources
- Base fips code
- Adjusting period

## Data processing

Before generating the report: confirmed cases, ILI, CLI, and lab tests data must be analyzed.

See the [architecture documentation](../docs/architecture) for more information
and the [USDS Trajectory Analysis](./trajectory_analysis_USDS.R) file for the
source code.

See the [implemention](../docs/implementation) for the implementation details.

## Report generation

All of this is eventually put into a report with the naming schema of `{fips}.json`.

## Useful links

- [FIPS](https://en.wikipedia.org/wiki/Federal_Information_Processing_Standards)
- [FIPS State Codes](https://en.wikipedia.org/wiki/Federal_Information_Processing_Standard_state_code)
- [FIPS County Codes](https://www.census.gov/2010census/xls/fips_codes_website.xls)
- [CDC guidance](https://www.cdc.gov/coronavirus/2019-ncov/downloads/php/CDC-Activities-Initiatives-for-COVID-19-Response.pdf)
- [US Maps Geojson](https://github.com/jgoodall/us-maps)
- [Topo.json](https://github.com/topojson/topojson)
- [NDJSON](https://github.com/ndjson/ndjson-spec)
- [Zip Codes](https://www.irs.gov/pub/irs-utl/zip_code_and_state_abbreviations.pdf)

## Notes:

Due to the rapidly evolving nature of the project, some of the guidance can be out of date. There are semi-regular meetings with the CDC that result in changes to the guidance. Published documents will be located here: [CDC guidance](https://www.cdc.gov/coronavirus/2019-ncov/downloads/php/CDC-Activities-Initiatives-for-COVID-19-Response.pdf)
