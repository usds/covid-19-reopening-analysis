# Creates requirement function
# date must be Date type and must be contiguous
# count must be daily count of count for each individual day (not cumulative)

# install.packages("runner",repos = "http://cran.us.r-project.org")
# install.packages("tidyr", repos = "http://cran.us.r-project.org")
# install.packages("dplyr", repos = "http://cran.us.r-project.org")

writeCasesStateSpline <- function(df){
  df <- df[order(as.Date(df$date)),]
  stateCases <- casesSpline(df)
  write.csv(stateCases, "./toolkit/dist/toolkit/_scratch/cases.csv", row.names=FALSE, quote=FALSE)
  return(stateCases)
}
writeCasesCountySpline <- function(df){
  df <- df[order(as.Date(df$date)),]
  outputdf <- data.frame(stringsAsFactors=FALSE) 
  fips_codes = na.omit(unique(df$fips))
  for (i in 1:length(fips_codes)){
    dfseg = subset(df, fips == fips_codes[i])
    if (length(dfseg$count) < 4){ next }
    # df = df[df$County_Fips == fips_code]
    dataDate = as.Date(dfseg$date)
    # t = typeof()
    countyDF = casesSpline(dfseg)
    countyDF$fips = fips_codes[i]
    outputdf <- rbind(outputdf, countyDF)
  }
  write.csv(outputdf, "./toolkit/dist/toolkit/_scratch/county_cases.csv", row.names=FALSE, quote=FALSE)
  return(outputdf)
}


casesSpline <- function(df){
  case_data <- data.frame(date = df$date, count = df$count, pop=df$pop)
  case_data_cdc <- case_data %>% 
    mutate(# Spline for CDC
          # Running cumulative
           cumulative_count = cumsum(count),
          #  Rolling average
           rolling_mean_cdc = runner::mean_run(cumulative_count, 3),
           delta_cdc = rolling_mean_cdc - dplyr::lag(rolling_mean_cdc, default = 0),
           delta_cdc = ifelse(delta_cdc < 0, 0, delta_cdc),
          #  Spline and deriv on rolling average
           spline = compute_spline(date, delta_cdc, "spline"),
          #  Normalize spline
           spline = ifelse (spline < 0, 0, spline),
           deriv = compute_spline(date, delta_cdc, "derivative"),
           # 2 Week count
           n_2wk = runner::sum_run(count, 14),
           # 2 Week incidence floored
           inc_2wk = floor(n_2wk/pop*100000),
          #  Change in cases
          #  delta = runner::mean_run(cumulative_count, 3),
          #  delta = ifelse(delta < 0, 0, delta)
          # Fill in missing dates
          )
  case_data_full_dates <- case_data_cdc %>%
    complete(date = seq.Date(min(date), max(date), by="day"))
  return(case_data_full_dates)
}
writeSyndromicStateSpline <- function(df){
    df <- df[order(as.Date(df$date)),]

    stateSynDF = syndromicSpline(df)
    write.csv(stateSynDF, "./toolkit/dist/toolkit/_scratch/syndromic.csv", row.names=FALSE, quote=FALSE)
    return(stateSynDF)
}
writeSyndromicCountySpline <- function(df){
  df <- df[order(as.Date(df$date)),]
  outputdf <- data.frame(stringsAsFactors=FALSE) 
  fips_codes = na.omit(unique(df$fips))
  for (i in 1:length(fips_codes)){
    dfseg = subset(df, fips == fips_codes[i])
    if (length(dfseg$count) < 4){ next }
    # df = df[df$County_Fips == fips_code]
    dataDate = as.Date(dfseg$date)
    # t = typeof()
    countyDF = syndromicSpline(dfseg)
    countyDF$fips = fips_codes[i]
    outputdf <- rbind(outputdf, countyDF)
  }
  write.csv(outputdf, "./toolkit/dist/toolkit/_scratch/county_cases.csv", row.names=FALSE, quote=FALSE)
  return(outputdf)
}
syndromicSpline <- function(df){
  addSyndromicProps<- function(df, syndromic){
    syndromic_data <- data.frame(date = df$date, count = df[[syndromic]])
    syndromic_data <- syndromic_data[order(as.Date(syndromic_data$date)),]
    syndromic_data_cdc <- syndromic_data %>% 
    mutate(
           cumulative_count = cumsum(count),
          #  Spline and deriv on rolling average
           spline = compute_spline(date, count, "spline"),
           spline = ifelse (spline < 0, 0, spline),
           deriv = compute_spline(date, count, "derivative"),
           # 2 Week count
           n_2wk = runner::sum_run(count, 14)
           )
    
    syndromic_data_full_dates <- syndromic_data_cdc %>%
      complete(date = seq.Date(min(date), max(date), by="day"))
    return(syndromic_data_full_dates)
  }
  syndromicCLI <- addSyndromicProps(df, "cli")
  syndromicILI <- addSyndromicProps(df, "ili")
  syndromicDF <- data.frame(date = df$date, ili = df$ili, cli = df$cli)
  syndromicDF$cli_spline <- syndromicCLI$spline
  syndromicDF$cli_deriv <- syndromicCLI$deriv
  syndromicDF$cli_n_2wk <- syndromicCLI$n_2wk
  syndromicDF$cli_cumulative <- syndromicCLI$cumulative_count

  syndromicDF$ili_spline <- syndromicILI$spline
  syndromicDF$ili_deriv <- syndromicILI$deriv
  syndromicDF$ili_n_2wk <- syndromicILI$n_2wk
  syndromicDF$ili_cumulative <- syndromicILI$cumulative_count

  return (syndromicDF)
}

writePositivityStateSpline <- function(df){
    df <- df[order(as.Date(df$date)),]
    stateTestsDF = positivitySpline(df)
    write.csv(stateTestsDF, "./toolkit/dist/toolkit/_scratch/state_tests.csv", row.names=FALSE, quote=FALSE)
    return(stateTestsDF)
}
positivitySpline <- function(df){
  addPositivityProps<- function(df, type){
    positivity_data <- data.frame(date = df$date, count = df[[type]], pop=df$pop)
    positivity_data <- positivity_data[order(as.Date(positivity_data$date)),]

    positivity_data_cdc <- positivity_data %>% 
    mutate(
           cumulative_count = cumsum(count),
           n_1wk = runner::sum_run(count, 7),
           per100k_cap_1wk = floor(n_1wk/pop*100000),
          #  Spline and deriv on rolling average
           spline = compute_spline(date, count, "spline"),
           deriv = compute_spline(date, count, "derivative"),
           spline = ifelse (spline < 0, 0, spline),
           
           )
    positivity_full_dates <- positivity_data_cdc %>%
      complete(date = seq.Date(min(date), max(date), by="day"))         
    return(positivity_full_dates)
  }
  testsPositiveOutput <- addPositivityProps(df, "percent_positive")
  testsTotalOutput <- addPositivityProps(df, "total")

  positivityDF <- data.frame(
    date = df$date, 
    positive= df$positive,
    percent_positive = df$percent_positive,
    percent_positive_spline = testsPositiveOutput$spline,
    percent_positive_deriv = testsPositiveOutput$deriv,
    total = df$total,
    total_spline = testsTotalOutput$spline,
    total_deriv = testsTotalOutput$deriv,
    total_cumulative = testsTotalOutput$cumulative_count,
    total_1wk_per_cap_100k = testsTotalOutput$per100k_cap_1wk,
    median_time_to_test = df$median_time_to_test 
    )
  return (positivityDF)
}

writeHospitalSpline <- function(df){
    df <- df[order(as.Date(df$date)),]

    stateHospitalDF = hospitalSpline(df)

    write.csv(stateHospitalDF, "./toolkit/dist/toolkit/_scratch/state_hosp.csv", row.names=FALSE, quote=FALSE)
    return(stateHospitalDF)
}
hospitalSpline <- function(df){
  addHospitalProps<- function(df){
    hospital_data <- data.frame(date = df$date, count = df$c19_inpatient_burden)
    hospital_data <- hospital_data[order(as.Date(hospital_data$date)),]
    hospital_data_cdc <- hospital_data %>% 
    mutate(
          #  Spline and deriv on rolling average
           spline = compute_spline(date, count, "spline"),
           spline = ifelse (spline < 0, 0, spline),
           deriv = compute_spline(date, count, "derivative"),
           )

    hospital_data_cdc$hospital_count = df$hospital_count
    hospital_data_cdc$hospitals_missing_ppe_data = df$hospitals_missing_ppe_data
    hospital_data_cdc$percent_hospitals_reporting_insufficient_ppe = df$percent_hospitals_reporting_insufficient_ppe
    hospital_data_cdc$percent_hospitals_reporting_staffShortage = df$percent_hospitals_reporting_staffShortage
    hospital_data_cdc$icu_occupancy_percentage = df$icu_occupancy_percentage
    hospital_data_cdc$c19_inpatient_burden = df$c19_inpatient_burden

    hospital_data_full_dates <- hospital_data_cdc %>%
      complete(date = seq.Date(min(date), max(date), by="day"))

    return(hospital_data_full_dates)
  }

  hospitalData <- addHospitalProps(df)
  return (hospitalData)
}
compute_spline <- function(date, count, type = "spline") {
  
  splineModel <- smooth.spline(x = as.numeric(date), 
                y = count, 
                spar = .5)
  
  if(type == "spline") return(predict(splineModel, as.numeric(date))$y)
  
  if(type == "derivative") return(predict(splineModel, as.numeric(date), 
                                          deriv = 1)$y)
  
}