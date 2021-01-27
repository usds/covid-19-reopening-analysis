## Status: Inactive

This project is currently inactive due to the lack of adoption by State governments. After removing any sensitive data, the application is not currently functioning. Please reach out to [Kelvin Luu](kelvin.t.luu@omb.eop.gov) if you have a use case for this project.

# COVID-19 Indicators for Reopening

> ... we are still putting on our shoes.

This project is a public repository that has been stripped of all state-associated data. This has resulted in a lot of missing peices for anyone that attempts to start this project.

Until we have the bandwidth to provide dummy data for all the fields, please feel free to reach out to [Kelvin Luu](kelvin.t.luu@omb.eop.gov) for help with your use case; you will need familiarity with node and R for the processing, and react for the display.

Most of this is out of date and/or provisional.

## Background

In April 2020, the White House published a three-phased approach to provide broad guidance to states for reopening. The White House guidance was supplemented by a detailed technical document developed and published by the Centers for Diseases Control & Prevention (CDC) in May 2020. The intent of the three-phased, data-driven approach is to mitigate risk of resurgence and while reopening states' economies. The key indicators used to gauge the readinesss of states for reopening include: _influenza-like illnesses_, _covid-like illnesses_, _documented cases_, _positive tests_, _hospital readiness_, and a thorough _testing program_. See the [implementation file](./docs/implementation.md) for more details.

Although many states have COVID-19 dashboards that provide daily statistics of cases, hospitalizations, and deaths, not very many states are tracking against the reopening indicators **and** publicly sharing the information to allow individuals and local businesses to determine how and what actions they would like to take regarding reopening activties.

The goal of our project is to assist states in applying the CDC technical guidance as part of the White House Opening Up America Again guidelines so the public can be informed with regards to how their state is tracking against the Opening Up America Again indicators or gating criteria.

This project also serves as a status page, not a data dashboard, where the general public can see the state of the crisis in their region as the CDC would. This helps to address the genral data overload that we have seen in the past several months.

## TOC

- [Technical overview](./docs/architecture.md)
- [Indicators and implementation](./docs/implementation.md)
- [Analysis Generation - Data generation scripts](./toolkit/README.md)

### Installation

Clone and install the node dependencies:

```sh
$ git clone <repo location>
$ yarn install
```

### Running locally

If you need to see a specific dataset, first run the data analysis as described in the section below.
Start the application, by default it runs on on port 3000 and can be accessed from the browser.

```sh
$ yarn start
```

The environment variable REACT_APP_BASE_FIPS controls which state's dataset is loaded (using a FIPS code).
There are some state-specific start commands in the `package.json` file.

At the moment there are no unit or integration tests, but the project is configured to process tests that it finds.
To create a test, give it the extension `.test.tsx`. The `App.test.tsx` is an example.
To run tests, use `yarn test`.

Storybook has been used to allow some components to be tested with different data views. The story files are in `src/stories`.
To run Storybook, use `yarn storybook`. It starts a browser window on port 9009 to view stories.

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Generating production code

The `yarn build` command builds and bundles static assets in the `build` folder.
(You will also need to build a dataset from state data as described below before deploying.)
Once built, this folder is self-contained, including necessary graph and statistical data, and can be copied to another
location to be served.

### Data processing and statistics generation

The utility scripts in `/toolkit/util/` are written in TypeScript, so the following command should be run any time those files are edited:

```sh
$ yarn analysis:generate
```

There is a unique generation command for each state in the `package.json` file. The generation command processes the incoming raw data,
does the statistical analysis, and places the result into the `/public` folder for use by the application.
For example, to process Georgia data:

```sh
$ yarn analysis:ga
```
