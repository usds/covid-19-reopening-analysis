Last updated: 08/03/2020

# CDC Criteria and Phase Analysis Guidance - DRAFT

## Analysis

Bases on the following gating categories and criteria:

Indicators based on symptoms [p.24]:

```
* Indicators bases on symptoms
    1. Downward trajectory of influenza-like illnesses (ILI syndrome) reported within a 14-day period
    AND
    2. Downward trajectory of COVID-like syndromic cases (i.e., COVID-like illness or CLI syndrome) reported
within a 14-day period
* Indicators based on cases:
    3. Downward trajectory of documented COVID-19 cases within a 14-day period
    OR
    4. Downward trajectory of positive tests as a percent of total tests within a 14-day period (concurrent with a flat or increasing volume of tests)
* Indicators for hospital readiness:
    5. Capacity to treat all patients without utilization of crisis care standards
    AND
    6. Robust testing program in place for at-risk healthcare workers, including antibody testing
```

### ILI

Apply a [spline](#spline) to the daily crude ILI counts.

- Data: ED ILI Count
- Rebound: Could be indicated by 5 consecutive days of `increasing` or `plateau` during a period of sustained decline, but not during influenze season.
- Grade period: 5 days
- Data Consistency period: 3 days
- Sustained decline: At least 5 days of a `decreasing` slope

Slope does not play a role if the `lowimpact` epi category applies.

To pass this criteria you must have 14 consecutive days (excepting the grace period) of either `lowimpact`, `decreasing`, or `plateau` and the most recent day must have a spline value lower than the beginning of the sustained decline.

Epi categories - ILI:

- `lowimpact`
  - ILI activity values within two standard deviations of the non-influenza week mean
- `decreasing`
  - spline derivative (slope) `< 0`
- `plateau`
  - spline derivative `== 0`
- `increasing`
  - spline derivative `> 0`

### CLI

Apply a [spline](#spline) to the daily crude CLI counts.

- Data: ED CLI Count
- Rebound 5 consecutive days of `increase` or `plateau` during a period of sustained decline
- Grade period: 5 days
- Data Consistency period: 3 days
- Sustained decline: At least 5 days of a `decreasing` slope

Slope does not play a role if the `pre-pandemic` epi category applies.

To pass this criteria you must have 14 consecutive days (excepting the grace period) of either `pre-pandemic`, `decreasing`, or `plateau` and the most recent day must have a spline value lower than the beginning of the sustained decline.

Epi categories - ILI:

- `pre-pandemic`
  - below the levels of CLI with symptoms on a monthly basis applied
    to the region before the pandemic (i.e. 2019).
- `decreasing`
  - spline derivative (slope) `< 0`
- `plateau`
  - spline derivative `== 0`
- `increasing`
  - spline derivative `> 0`

### Cases

Using downward trajectory with a [spline](#spline) of the 3 day rolling average of daily case counts.

- Data: Case count, US Census population estimates
- Plateau slope cut: `0.1` (CDC `covid-response-analysis` codebase)
- Rebound: 5 consecutive days of `increasing`
- Grade period: 5 days
- Cases: date of report
- Data Consistency period: 3 days

Slope does not play a role if the `low-incidence` epi category applies.

To pass this criteria you must have 14 consecutive days (excepting the grace period) of either `low-incidence-plateau`, `decreasing`, or `plateau` and the most recent day must have a spline value lower than the beginning of the sustained decline.

Epi categories - ILI:

- `low-incidence`
  - A low-incidence plateau is defined as a very low number of new cases reported (below 10 cases per 100,000 population over 2 weeks) with only minimal change in daily cases. To qualify for this category, a locality must previously have seen elevated case counts (i.e. have been above 10 cases per 100,000 at some point).
- `decreasing`
  - spline derivative (slope) `< 0`
- `plateau`
  - spline derivative `>= 0` and `< slope cut`
- `increasing`
  - spline derivative `>= slope cut`

Notes:

- Excluding recent onset dates or report dates (e.g., in the last 3 days or last week if onset dates are used) from assessment of trends should be considered to ensure that incomplete reporting of recent cases does not give the false appearance of downward trajectory. [p.29]

### Tests

Using a [spline](#spline) of the percent positive tests.

> Methods to assess decreases in laboratory test positivity are similar to those used to assess decreases in ILI and CLI. [p.29]

Additionally using a [spline](#spline) of the total tests.

- Data: ELR data
- Decreasing total tests slope cut: `-0.1`
  - More than 1000 tests per 100k population satisfies this requirement
- Near zero positivity level: `0.02`
- Rebound: 5 consecutive days of `increasing`, `plateau`, `decreasing_total_tests`
- Grade period: 5 days
- Data Consistency period: 3 days

Slope does not play a role if the `near-zero` epi category applies to positivity while total tests are `increasing` or `plateau`.

To pass this criteria you must have 14 consecutive days (excepting the grace period) of `near-zero`, `decreasing`, or `plateau` test positivity with an `increasing` or `plateau` of total tests; additionally the most recent day must be higher than at the start of the period of sustained decline, or in the `near-zero` category.

Epi categories - positivity:

- `near-zero`
- `decreasing`
  - positivity derivative (slope) `< 0`
- `plateau`
  - positivity derivative `== 0`
- `increasing`
  - positivity derivative `> 0`
- `decreasing_total_tests`
  - total derivative `<= decreasing total tests slope cut` && totalPer100k `< 1000`

### Hospital Data

- Data: Hospital data
- Rebound: 5 days of increasing c19 burden
- Grade period: 5 days

To pass this criteria you must have meet all of the following criteria:

- 14 days of decreasing c19 burden
- totalIcuOccupancyPercent `<= 0.8`
- c19InpatientBurdenPercent `> [.15,.10,.05]` (phase 1,2,3)
- hospitals with insufficient PPE as a percent `< [.05,.03,0]`
  - where insufficient is <=3 days supply of _any_ supply
- hospitals with insufficient staff as a percent `<[.1,.1,.05]`
  - where insufficient is missing _any_ key staff

### Robust Testing Program

- Data: Hospital data
- Rebound: N/A
- Grade period: 0 days

To pass this criteria you must meet both criteria:

- percentage positive tests <= [15,10,5]% for 14 days
- median time from test order to results < [4,3,2] days

Note:

> Lags in test reporting may lead to incomplete data for calculating percent positive tests for the most recent few days. Jurisdictions should calculate percent positive for the most recent 14 days with near-complete testing data.

## Definitions

### Spline

A cubic spline applied to smooth out variability in the data. [p.25].

### Cut point

The derivative of the spline, or the slope/rate-of-change, which identifies the upper boundary for a plateau (with 0 being the lower boundary).

### Downward trajectory

When using a spline curve, the derivative (or slope) of the spline when below 0.

### Grace period

A period of time that allows for irregularities of the data when trying to meet a phase criteria. Unrelated to having a [rebound](#rebound)

### Rebound

A rebound in COVID-19 activity following a downward trajectory of 14 or more days, including any grace period applied. [p.28]

### Reset

> Informal

The resetting of the start of a 14-day period; this coincides the last day of a consecutive series of days longer than the [grace period](#grace-period) that have an `increasing` epi category.
