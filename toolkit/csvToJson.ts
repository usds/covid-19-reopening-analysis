import fs from "fs";
import moment from "moment";
import path from "path";

const stream = require("stream");
const { Transform } = stream;

const parse = require("csv-parse");

const transformObjectExample = {
  jsonValue: "csv Key"
};
/**
 * Takes in an object of keys to csvKeys
 */
class CSVtoJSON extends Transform {
  constructor(transformObject, dateFormat) {
    super({
      readableObjectMode: false,
      writableObjectMode: true
    });

    this._transformObject = transformObject;
    this._keys = Object.keys(transformObject);
    this._dateFormat = dateFormat;
    this._sep = "";
  }
  _transform(chunk, _encoding, next) {
    const stringChunk = this._sep + JSON.stringify(this.transformCSV(chunk));
    this._sep = ",";
    return next(null, stringChunk);
  }
  transformCSV(data) {
    let csvKey;
    return this._keys.reduce((acc, key) => {
      csvKey = this._transformObject[key];
      // Handle arbitrary transformations...
      if (typeof csvKey === "function") {
        acc[key] = csvKey(data);
        return acc;
      }
      if (typeof data[csvKey] === undefined || data[csvKey] === "NA") {
        acc[key] = null;
        return acc;
      }
      if (key === "date" && this._dateFormat) {
        acc[key] = moment(data[csvKey], this._dateFormat).valueOf();
        acc["nativeDate"] = data[csvKey];
        return acc;
      }
      if (!isNaN(data[csvKey])) {
        acc[key] = +(+data[csvKey]).toFixed(4);
        return acc;
      }
      acc[key] = data[csvKey];
      return acc;
    }, {});
  }
}

function writeToJson(csvFile, jsonFile, objectAdapter, dateFormat) {
  return new Promise((resolve, reject) => {
    const csvTransform = new CSVtoJSON(objectAdapter, dateFormat);
    const stateStream = fs.createReadStream(csvFile, { encoding: "utf8" });
    const writeJSON = fs.createWriteStream(jsonFile);
    const parser = parse({
      delimiter: ",",
      columns: true,
      cast: true
    });

    const destroyStreams = err => {
      console.error(err);
      stateStream.destroy();
      parser.destroy();
      csvTransform.destroy();
      writeJSON.destroy();
      fs.unlinkSync(jsonFile);
      reject(err);
    };
    // start the array...
    writeJSON.write("[");

    stateStream.on("error", function(err) {
      return destroyStreams(err);
    });
    parser.on("error", function(err) {
      return destroyStreams(err);
    });
    csvTransform.on("error", function(err) {
      return destroyStreams(err);
    });
    writeJSON.on("error", function(err) {
      return destroyStreams(err);
    });

    stateStream
      .pipe(parser)
      .pipe(csvTransform)
      .pipe(writeJSON, { end: true });
    // close the array...

    stateStream.on("close", () => {
      writeJSON.on("finish", () => {
        fs.appendFileSync(jsonFile, "]");
        resolve();
      });
    });
  });
}

const scratchFolder = path.join(__dirname, "..", "_scratch");

if (!fs.existsSync(scratchFolder)) {
  fs.mkdirSync(scratchFolder, { recursive: true });
}
fs.writeFileSync(
  path.join(scratchFolder, "last_write"),
  JSON.stringify(new Date())
);

const caseAdapter = {
  date: "date",
  count: "count",
  population: "population",
  spline: "spline",
  deriv: "deriv",
  n2wk: "n_2wk",
  pop: "pop",
  ci2wk: "inc_2wk",
  cumulativeCount: "cumulative_count",
  fips: "fips"
};

const iliAdapter = {
  date: "date",
  count: "ili",
  // ,"Population"
  spline: "ili_spline",
  deriv: "ili_deriv",
  n2wk: "ili_n_2wk",
  cumulativeCount: "ili_cumulative"
};

const cliAdapter = {
  date: "date",
  count: "cli",
  // ,"Population"
  spline: "cli_spline",
  deriv: "cli_deriv",
  n2wk: "cli_n_2wk",
  cumulativeCount: "cli_cumulative"
};

const testsAdapter = {
  total: "total",
  totalSpline: "total_spline",
  totalDeriv: "total_deriv",
  totalPer100kCap: "total_1wk_per_cap_100k",
  positive: "positive",
  percentPositive: "percent_positive",
  percentPositiveSpline: "percent_positive_spline",
  percentPositiveDeriv: "percent_positive_deriv",
  date: "date",
  fips: "fips",
  totalCumulative: "total_cumulative",
  percentPositiveCumulative: "percent_positive_cumulative",
  medianTimeToTest: "median_time_to_test"
};

const hospAdapter = {
  date: "date",
  c19BurdenSpline: "spline",
  c19BurdenDeriv: "deriv",
  hospCount: "hospital_count",
  hospMissingPPE: "hospitals_missing_ppe_data",
  insuffienctPPEPercent: "percent_hospitals_reporting_insufficient_ppe",
  staffShortagePercent: "percent_hospitals_reporting_staffShortage",
  icuOccupancyPercentage: "icu_occupancy_percentage",
  c19InpatientBurdenPercentage: "c19_inpatient_burden"
};

const stateTestsInput = path.join(scratchFolder, "state_tests.csv");
const stateHospInput = path.join(scratchFolder, "state_hosp.csv");

const stateCaseInput = path.join(scratchFolder, "cases.csv");
const stateSyndromicInput = path.join(scratchFolder, "syndromic.csv");

const stateILIOutput = path.join(scratchFolder, "stateILI.json");
const stateCLIOutput = path.join(scratchFolder, "stateCLI.json");
const stateCaseOutput = path.join(scratchFolder, "stateCases.json");
const stateTestsOutput = path.join(scratchFolder, "stateTests.json");
const stateHospOutput = path.join(scratchFolder, "stateHosp.json");

const countyCasesInput = path.join(scratchFolder, "county_cases.csv");
const countyCasesOutput = path.join(scratchFolder, "countyCases.json");

writeToJson(stateCaseInput, stateCaseOutput, caseAdapter, "YYYY-MM-DD")
  .then(() => console.log("state: Case write successful"))
  .catch(err => {
    throw err;
  });

writeToJson(stateSyndromicInput, stateILIOutput, iliAdapter, "YYYY-MM-DD")
  .then(() => console.log("state: ILI write successful"))
  .catch(err => {
    throw err;
  });

writeToJson(stateSyndromicInput, stateCLIOutput, cliAdapter, "YYYY-MM-DD")
  .then(() => console.log("state: CLI write successful"))
  .catch(err => {
    throw err;
  });

writeToJson(stateTestsInput, stateTestsOutput, testsAdapter, "YYYY-MM-DD")
  .then(() => console.log("state: Tests write successful"))
  .catch(err => {
    throw err;
  });

writeToJson(stateHospInput, stateHospOutput, hospAdapter, "YYYY/MM/DD")
  .then(() => console.log("state: Hosp write successful"))
  .catch(err => {
    throw err;
  });

writeToJson(countyCasesInput, countyCasesOutput, caseAdapter, "YYYY/MM/DD")
  .then(() => console.log("County: Case write successful"))
  .catch(err => {
    throw err;
  });
