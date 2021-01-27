
# install.packages("runner",repos = "http://cran.us.r-project.org")
# install.packages("tidyr", repos = "http://cran.us.r-project.org")
# install.packages("tibble", repos = "http://cran.us.r-project.org")

source("./toolkit/util/trajectory_analysis_USDS.R")
library("tidyr")
library("dplyr")
library("runner")
library("tibble")

#region lab tests
     statePositivityInput = read.csv('./locality/lab_data.csv');
     statePositivityDateFmt = "%m/%d/%y"

     # Column remapping
     colnames(statePositivityInput)[which(names(statePositivityInput) == "Date")] <- "date"
     statePositivityInput$date = as.Date(statePositivityInput$date, statePositivityDateFmt)

     colnames(statePositivityInput)[which(names(statePositivityInput) == "Total_Tested")] <- "total"
     colnames(statePositivityInput)[which(names(statePositivityInput) == "Total_Negatives")] <- "negative"
     colnames(statePositivityInput)[which(names(statePositivityInput) == "Total_Positives")] <- "positive"
     # Aggregate tests and generate state data
     stateTestsInput = statePositivityInput[,-1] %>% 
          group_by(date) %>% 
          summarise_all(funs(sum))
     print("Population: 11111111")
     stateTestsInput$pop <- 11111111

     print("Currently deviating from CDC criteria where positivity should be positive/(positive+negative)")
     stateTestsInput$percent_positive <- stateTestsInput$positive / stateTestsInput$total
     # stateTestsInput$percent_positive <- stateTestsInput$positive / (stateTestsInput$positive + stateTestsInput$negative)
     print("All median time to test data currently overwritten - not in original dataset)")
     stateTestsInput$median_time_to_test <- NA
     # stateTestsInput$median_time_to_test[is.na(stateTestsInput$median_time_to_test)] <- NA

     temp = writePositivityStateSpline(stateTestsInput)
#endregion


#region cases
     casesStateInput = read.csv('./locality/cases_state.csv');

     # Column remapping
     colnames(casesStateInput)[which(names(casesStateInput) == "Day")] <- "date"
     casesStateInput$date = as.Date(casesStateInput$date, "%m/%d/%Y")
     colnames(casesStateInput)[which(names(casesStateInput) == "N")] <- "count"
     colnames(casesStateInput)[which(names(casesStateInput) == "Population")] <- "pop"
     
     temp = writeCasesStateSpline(casesStateInput)

     # county files
     casesCountyInputFile = read.csv('./locality/cases_county.csv');
     # Column remapping
     colnames(casesCountyInputFile)[which(names(casesCountyInputFile) == "Day")] <- "date"
     casesCountyInputFile$date = as.Date(casesCountyInputFile$date, "%m/%d/%y")
     colnames(casesCountyInputFile)[which(names(casesCountyInputFile) == "N")] <- "count"
     colnames(casesCountyInputFile)[which(names(casesCountyInputFile) == "Population")] <- "pop"
     colnames(casesCountyInputFile)[which(names(casesCountyInputFile) == "County_Fips")] <- "fips"
     
     temp = writeCasesCountySpline(casesCountyInputFile);

#endregion


#region syndromic
     synInputFile = read.csv('./locality/syndromic_state.csv');
     # Column remapping
     colnames(synInputFile)[which(names(synInputFile) == "Date")] <- "date"
     synInputFile$date = as.Date(synInputFile$date, "%d-%b-%y")
     colnames(synInputFile)[which(names(synInputFile) == "Ili")] <- "ili"
     colnames(synInputFile)[which(names(synInputFile) == "Covid")] <- "cli"
     
     temp = writeSyndromicStateSpline(synInputFile)
     # temp = writeSyndromicCountySpline(synInputFile)
#endregion

#region Generate column names for hospdata
# Hospital data is stored as a single file for each day for this locality
files <- list.files(path="./locality/hosp_data", pattern="*.csv", full.names=FALSE, recursive=FALSE)

hospColumns = c("facility")
hospDF <- lapply(files, function(x) {
     inputFile = paste("./locality/hosp_data/",x, sep = "", collapse = NULL)
     currentDF <- read.csv(inputFile) # load file

     # Rename files that have odd naming:
     if("What.is.the.total.number.of.Staffed.Non.ICU.Beds.at.your.facility." %in% names(currentDF)){
          renameColumns <- c(
               What.is.the.total.number.of.Staffed.Non.ICU.Beds.at.your.facility.="HOS...COVID.Bed.001",
               What.is.the.number.of.Staffed.Occupied.Non.ICU.Beds.at.your.facility.="HOS...COVID.Bed.002",
               What.is.the.total.number.of.Staffed.ICU.Beds.at.your.facility.="HOS...COVID.Bed.003",
               What.is.the.number.of.Staffed.Occupied.ICU.Beds.at.your.facility.="HOS...COVID.Bed.004",
               Number.of.Patients..locality.Residents..currently.hospitalized.in.an.inpatient.non.ICU.bed.who.have.tested.positive.COVID.19="HOS...COVID.Patients.001",
               Number.of.Patients..locality.Residents..currently.hospitalized.in.an.inpatient.non..ICU.bed.who.are.suspected..but.have.not.yet.tested.positive..of.having.COVID.19="HOS...COVID.Patients.002",
               Number.of.Patients..Non.locality.Residents..currently.hospitalized.in.an.inpatient.non.ICU.bed.who.have.tested.positive.COVID.19="HOS...COVID.Patients.003",
               Number.of.Patients..Non.locality.Residents..currently.hospitalized.in.an.inpatient.bed.who.have.tested.positive.COVID.19="HOS...COVID.Patients.004",
               Number.of.Patients..locality.Residents..currently.hospitalized.in.an.inpatient.ICU.bed.who.have.tested.positive.COVID.19="HOS...COVID.Patients.005",
               Number.of.Patients..locality.Residents..currently.hospitalized.in.an.inpatient.ICU.bed.who.are.suspected..but.have.not.yet.tested.positive..of.having.COVID.19="HOS...COVID.Patients.006",

               Number.of.Patients..Non.locality.Residents..currently.hospitalized.in.an.inpatient.ICU.bed.who.have.tested.positive.COVID.19="HOS...COVID.Patients.007",
               Number.of.Patients..Non.locality.Residents..currently.hospitalized.in.an.inpatient.ICU.bed.who.are.suspected..but.have.not.yet.tested.positive..of.having.COVID.19="HOS...COVID.Patients.008",
               Number.of.Patients..locality.Residents..currently.hospitalized.in.an.inpatient.bed.who.have.tested.positive.COVID.19.and.are.on.a.mechanical.ventilator="HOS...COVID.Patients.009",
               Number.of.Patients..locality.Residents..currently.hospitalized.in.an.inpatient.bed.who.are.suspected..but.have.not.yet.tested.positive..of.having.COVID.19.and.are.on.a.mechanical.ventilator="HOS...COVID.Patients.010",
               Number.of.Patients..Non.locality.Residents..currently.hospitalized.in.an.inpatient.bed.who.have.tested.positive.COVID.19.and.are.on.a.mechanical.ventilator="HOS...COVID.Patients.011",
               Number.of.Patients..Non.locality.Residents..currently.hospitalized.in.an.inpatient.bed.who.are.suspected..but.have.not.yet.tested.positive..of.having.COVID.19.and.are.on.a.mechanical.ventilator="HOS...COVID.Patients.012",
               What.is.the.total.number.of.N95.masks.in.stock.and.available.to.utilize.at.your.facility..Use.individual.count="HOS...COVID.Supplies.001",
               Under.current.conditions.how.long.will.your.current.supply.of.N95.masks.last..domain.list...Doesn.t.need.to.be.used.in.power.bi..="HOS...COVID.Supplies.002",
               What.is.the.total.number.of.surgical.masks.in.stock.and.available.to.utilize.at.your.facility..Use.individual.count="HOS...COVID.Supplies.003",
               Under.current.conditions.how.long.will.your.current.supply.of.surgical.masks.last..domain.list...Doesn.t.need.to.be.used.in.power.bi..="HOS...COVID.Supplies.004",
               What.is.the.total.number.of.face.shields.in.stock.and.available.to.utilize.at.your.facility..Use.individual.count="HOS...COVID.Supplies.005",
               Under.current.conditions.how.long.will.your.current.supply.of.face.sheilds..last..domain.list...Doesn.t.need.to.be.used.in.power.bi..="HOS...COVID.Supplies.006",
               What.is.the.total.number.of.gowns.in.stock.and.available.to.utilize.at.your.facility..Use.individual.count="HOS...COVID.Supplies.007",
               Under.current.conditions.how.long.will.your.current.supply.of.gowns..last..domain.list...Doesn.t.need.to.be.used.in.power.bi..="HOS...COVID.Supplies.008",
               What.is.the.total.number.of.gloves.in.stock.and.available.to.utilize.at.your.facility..Use.individual.count="HOS...COVID.Supplies.009",
               Under.current.conditions.how.long.will.your.current.supply.of.gloves..last..domain.list...Doesn.t.need.to.be.used.in.power.bi..="HOS...COVID.Supplies.010",
               What.is.the.total.number.of.PAPRS.in.stock.and.available.to.utilize.at.your.facility..Use.individual.count="HOS...COVID.Supplies.011",
               Under.current.conditions.how.long.will.your.current.supply.of.PAPRS.last..domain.list...Doesn.t.need.to.be.used.in.power.bi..="HOS...COVID.Supplies.012",
               What.is.the.total.number.of.COVID.19.tests.your.lab.facility.can.process.each.day.="HOS...COVID.Test.Lab.001",
               What.is.the.number.of.new.COVID.19.diagnostic.tests.ordered.by.a.healthcare.provider..midnight.to.midnight.cutoff..tests.ordered.on.previous.date.queried="HOS...COVID.Test.Lab.002",
               What.is.the.cumulative.number.of.COVID.19.diagnostic.tests.ordered.by.a.healthcare.provider..All.tests.ordered.to.date.="HOS...COVID.Test.Lab.003",
               What.is.the.number.of.new.Covid.19.tests.performed.yesterday..midnight.to.midnight.cutoff..tests.performed.on.previous.date.queried="HOS...COVID.Test.Lab.004",
               What.is.the.cumulative.number.of.tests.performed..All.tests.with.results.to.date="HOS...COVID.Test.Lab.005",
               What.is.the.total.number.of.positive.COVID.19.testing.results.at.your.facility.from.yesterday..midnight.to.midnight.cutoff..positive.tests.results.released.on.previous.date.queried="HOS...COVID.Test.Lab.006",
               What.is.the.cumulative.number.of.positive.test.results..All.positive.test.results.released.to.date="HOS...COVID.Test.Lab.007",
               What.is.the.total.number.of.negative.COVID.19.testing.results.at.your.facility.from.yesterday..midnight.to.midnight.cutoff..negative.tests.results.released.on.previous.date.queried="HOS...COVID.Test.Lab.008",
               What.is.the.cumulative.number.of.negative.tests.results..All.negative.test.results.released.to.date="HOS...COVID.Test.Lab.009",
               How.many.mechanical.ventilators.does.your.facility.have.in.total.="HOS...COVID.Vents.001",
               What.is.the.number.of.mechanical.ventilators.currently.in.use.at.your.facility.="HOS...COVID.Vents.002",
               ModifiedOn="ModifiedOn",
               Facility.Name="Facility.Name"
               )
          names(currentDF) <- renameColumns[names(currentDF)]
          currentDF$Division <- NA
     }
     # Rename all columns
     renameColumns <- c(
               Facility.Name="facility",
               HOS...COVID.Bed.001="non_icu_beds_staffed",
               HOS...COVID.Bed.002="non_icu_beds_occupied",
               HOS...COVID.Bed.003="icu_beds_staffed",
               HOS...COVID.Bed.004="icu_beds_occupied",

               HOS...COVID.Patients.001="inpatient_resident_non_icu_bed_positive",
               HOS...COVID.Patients.002="inpatient_resident_non_icu_bed_suspected",

               HOS...COVID.Patients.003="inpatient_nonResident_non_icu_bed_positive",
               HOS...COVID.Patients.004="inpatient_nonResident_bed_positive",

               HOS...COVID.Patients.005="inpatient_resident_icu_bed_positive",
               HOS...COVID.Patients.006="inpatient_resident_icu_bed_suspected",

               HOS...COVID.Patients.007="inpatient_nonResident_icu_bed_positive",
               HOS...COVID.Patients.008="inpatient_nonResident_icu_bed_suspected",


               HOS...COVID.Patients.009="inpatient_resident_ventilator_bed_positive",
               HOS...COVID.Patients.010="inpatient_resident_ventilator_bed_suspected",

               HOS...COVID.Patients.011="inpatient_nonResident_ventilator_bed_positive",
               HOS...COVID.Patients.012="inpatient_nonResident_ventilator_bed_suspected",

               HOS...COVID.Supplies.001="total_stock_n95s",
               HOS...COVID.Supplies.002="days_of_supply_n95s",

               HOS...COVID.Supplies.003="total_stock_surgical_masks",
               HOS...COVID.Supplies.004="days_of_supply_surgical_masks",
               
               HOS...COVID.Supplies.005="total_stock_face_sheilds",
               HOS...COVID.Supplies.006="days_of_supply_face_shields",
               
               HOS...COVID.Supplies.007="total_stock_gowns",
               HOS...COVID.Supplies.008="days_of_supply_gowns",

               HOS...COVID.Supplies.009="total_stock_gloves",
               HOS...COVID.Supplies.010="days_of_supply_gloves",
               
               HOS...COVID.Supplies.011="total_stock_paprs",
               HOS...COVID.Supplies.012="days_of_supply_paprs",

               HOS...COVID.Vents.001="total_stock_ventilators",
               HOS...COVID.Vents.002="in_use_ventilators",
               ModifiedOn="date"
               
               # HOS...COVID.Test.Lab.001="HOS...COVID.Test.Lab.001",
               # HOS...COVID.Test.Lab.002="HOS...COVID.Test.Lab.002",
               # HOS...COVID.Test.Lab.003="HOS...COVID.Test.Lab.003",
               # HOS...COVID.Test.Lab.004="HOS...COVID.Test.Lab.004",
               # HOS...COVID.Test.Lab.005="HOS...COVID.Test.Lab.005",
               # HOS...COVID.Test.Lab.006="HOS...COVID.Test.Lab.006",
               # HOS...COVID.Test.Lab.007="HOS...COVID.Test.Lab.007",
               # HOS...COVID.Test.Lab.008="HOS...COVID.Test.Lab.008",
               # HOS...COVID.Test.Lab.009="HOS...COVID.Test.Lab.009",
               # Division="division"
               )
          currentDF = currentDF[names(renameColumns)]
          names(currentDF) <- renameColumns[names(currentDF)]
          # fifteen_plus <- test[names(test)=="15 or more days"]
          # a[names(a)==435]


          # only select the things we care about... which is... a lot.
          currentDF = subset(currentDF, select=c(
               date
               ,facility
               ,non_icu_beds_staffed
               ,non_icu_beds_occupied
               ,icu_beds_staffed
               ,icu_beds_occupied
               ,inpatient_resident_non_icu_bed_positive
               ,inpatient_resident_non_icu_bed_suspected
               ,inpatient_nonResident_non_icu_bed_positive
               ,inpatient_nonResident_bed_positive
               ,inpatient_resident_icu_bed_positive
               ,inpatient_resident_icu_bed_suspected 
               ,inpatient_nonResident_icu_bed_positive 
               ,inpatient_nonResident_icu_bed_suspected 
               ,inpatient_resident_ventilator_bed_positive 
               ,inpatient_resident_ventilator_bed_suspected 
               ,inpatient_nonResident_ventilator_bed_positive 
               ,inpatient_nonResident_ventilator_bed_suspected
               ,total_stock_n95s
               ,days_of_supply_n95s
               ,total_stock_surgical_masks
               ,days_of_supply_surgical_masks
               ,total_stock_face_sheilds
               ,days_of_supply_face_shields
               ,total_stock_gowns
               ,days_of_supply_gowns
               ,total_stock_gloves
               ,days_of_supply_gloves
               ,total_stock_paprs
               ,days_of_supply_paprs
          ))
          return(currentDF)
     
})
hospDF <- do.call("rbind", hospDF)

# Clean up data
hospDF$date = as.Date(gsub( ".*(\\d{1,2}/\\d{1,2}/\\d{4}).*", "\\1", hospDF$date), "%m/%d/%Y")

# remove Non-dates
hospDF = hospDF[!is.na(hospDF$date),]
hospDF$non_icu_beds_staffed[is.na(hospDF$non_icu_beds_staffed)] <- 0
hospDF$non_icu_beds_occupied[is.na(hospDF$non_icu_beds_occupied)] <- 0
hospDF$icu_beds_staffed[is.na(hospDF$icu_beds_staffed)] <- 0
hospDF$icu_beds_occupied[is.na(hospDF$icu_beds_occupied)] <- 0
hospDF$inpatient_resident_non_icu_bed_positive[is.na(hospDF$inpatient_resident_non_icu_bed_positive)] <- 0
hospDF$inpatient_resident_non_icu_bed_suspected[is.na(hospDF$inpatient_resident_non_icu_bed_suspected)] <- 0
hospDF$inpatient_nonResident_non_icu_bed_positive[is.na(hospDF$inpatient_nonResident_non_icu_bed_positive)] <- 0
hospDF$inpatient_nonResident_bed_positive[is.na(hospDF$inpatient_nonResident_bed_positive)] <- 0
hospDF$inpatient_resident_icu_bed_positive[is.na(hospDF$inpatient_resident_icu_bed_positive)] <- 0
hospDF$inpatient_resident_icu_bed_suspected [is.na(hospDF$inpatient_resident_icu_bed_suspected )] <- 0
hospDF$inpatient_nonResident_icu_bed_positive [is.na(hospDF$inpatient_nonResident_icu_bed_positive )] <- 0
hospDF$inpatient_nonResident_icu_bed_suspected [is.na(hospDF$inpatient_nonResident_icu_bed_suspected )] <- 0
hospDF$inpatient_resident_ventilator_bed_positive [is.na(hospDF$inpatient_resident_ventilator_bed_positive )] <- 0
hospDF$inpatient_resident_ventilator_bed_suspected [is.na(hospDF$inpatient_resident_ventilator_bed_suspected )] <- 0
hospDF$inpatient_nonResident_ventilator_bed_positive [is.na(hospDF$inpatient_nonResident_ventilator_bed_positive )] <- 0
hospDF$inpatient_nonResident_ventilator_bed_suspected[is.na(hospDF$inpatient_nonResident_ventilator_bed_suspected)] <- 0


possible_supply_values = c("Zero Days","15 or more days", "4-14 days", "1-3 days")
# Add row numbers for uniqueness
     hospDF = rownames_to_column(hospDF, var = "rn")
     currentDF <- hospDF %>%
          mutate(
               inpatient_c19_total = inpatient_resident_non_icu_bed_positive + inpatient_resident_non_icu_bed_suspected +inpatient_nonResident_non_icu_bed_positive +inpatient_nonResident_bed_positive +inpatient_resident_icu_bed_positive +inpatient_resident_icu_bed_suspected  +inpatient_nonResident_icu_bed_positive  +inpatient_nonResident_icu_bed_suspected  +inpatient_resident_ventilator_bed_positive  +inpatient_resident_ventilator_bed_suspected  +inpatient_nonResident_ventilator_bed_positive  +inpatient_nonResident_ventilator_bed_suspected,
               days_of_supply_n95s_low = ifelse(days_of_supply_n95s == "15 or more days" | days_of_supply_n95s == "4-14 days" , FALSE, TRUE),
               days_of_supply_surgical_masks_low = ifelse(days_of_supply_surgical_masks == "15 or more days" | days_of_supply_surgical_masks == "4-14 days" , FALSE, TRUE),
               days_of_supply_face_shields_low = ifelse(days_of_supply_face_shields == "15 or more days" | days_of_supply_face_shields == "4-14 days" , FALSE, TRUE),
               days_of_supply_gowns_low = ifelse(days_of_supply_gowns == "15 or more days" | days_of_supply_gowns == "4-14 days" , FALSE, TRUE),
               days_of_supply_gloves_low = ifelse(days_of_supply_gloves == "15 or more days" | days_of_supply_gloves == "4-14 days" , FALSE, TRUE),
               days_of_supply_paprs_low = ifelse(days_of_supply_paprs == "15 or more days" | days_of_supply_paprs == "4-14 days" , FALSE, TRUE),
               
               # Determine which hospitals are missing PPE values (i.e. not reporting)
               hospital_ppe_missing = ifelse(
                    days_of_supply_n95s %in% possible_supply_values
               & days_of_supply_surgical_masks %in% possible_supply_values
               &  days_of_supply_face_shields %in% possible_supply_values
               &  days_of_supply_gowns %in% possible_supply_values
               &  days_of_supply_gloves %in% possible_supply_values
               &  days_of_supply_paprs %in% possible_supply_values
               ,0, 1 ),

               # flag hospitals that have any low supplies of PPE
               hospital_ppe_low = ifelse(days_of_supply_n95s_low 
                    | days_of_supply_surgical_masks_low 
                    | days_of_supply_face_shields_low 
                    | days_of_supply_gowns_low 
                    | days_of_supply_gloves_low 
                    | days_of_supply_paprs_low
                    , 1, 0)
          ) %>%
          # Group into date and facility to prep for removing of duplicates
          group_by(date, facility) %>% 
          # Remove duplicate hospital values and only use the most recent added (by rownum)
          slice(which.max(rn))

     currentDF <- currentDF %>%
          group_by(date) %>%
               mutate(
               # Total number of hospitals
               hospital_count = n(),
               hospitals_missing_ppe_data = sum(hospital_ppe_missing),
               percent_hospitals_reporting_insufficient_ppe = (sum(hospital_ppe_low)+sum(hospital_ppe_missing))/hospital_count,
               # No staff data for this dataset
               percent_hospitals_reporting_staffShortage = NA,
               # Get occupancy and burden
               icu_occupancy_percentage = ifelse(sum(icu_beds_staffed) > 0, sum(icu_beds_occupied)/sum(icu_beds_staffed), NA),
               c19_inpatient_burden = ifelse(sum(non_icu_beds_staffed) > 0, sum(inpatient_c19_total)/sum(non_icu_beds_staffed), NA)
               ) %>%
          slice(which.max(rn))




finalDF = subset(currentDF, select=c(
     date
     , hospital_count
     , hospitals_missing_ppe_data
     , percent_hospitals_reporting_insufficient_ppe
     , percent_hospitals_reporting_staffShortage
     , icu_occupancy_percentage
     , c19_inpatient_burden))
temp = writeHospitalSpline(finalDF)

#endregion