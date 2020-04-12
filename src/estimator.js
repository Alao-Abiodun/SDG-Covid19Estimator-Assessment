const NofInfectedPeople = (currentlyInfected, periodType, timeToElapse) => {
  if (periodType === 'months') {
    // eslint-disable-next-line no-param-reassign
    timeToElapse *= 30;
  } else if (periodType === 'weeks') {
    // eslint-disable-next-line no-param-reassign
    timeToElapse *= 7;
  }
  const doubleFactors = 2 ** Math.floor(timeToElapse / 3);
  return currentlyInfected * doubleFactors;
};

const impact = ({
  reportedCases,
  periodType,
  timeToElapse,
  totalHospitalBeds,
  region: { avgDailyIncomeInUSD, avgDailyIncomePopulation }
}) => {
  const infected = reportedCases * 10;
  const infectionsByRequestedTime = NofInfectedPeople(
    infected,
    periodType,
    timeToElapse
  );
  const severeCasesByRequestedTime = Math.trunc(
    0.15 * infectionsByRequestedTime
  );
  const hospitalBedsByRequestedTime = Math.trunc(
    totalHospitalBeds * 0.35 - severeCasesByRequestedTime
  );
  const casesForICUByRequestedTime = Math.trunc(
    0.05 * infectionsByRequestedTime
  );
  const casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * infectionsByRequestedTime
  );

  const dollarsInFlight = Math.trunc((
    infectionsByRequestedTime
    * avgDailyIncomeInUSD
    * avgDailyIncomePopulation) / timeToElapse);

  return {
    currentlyInfected: infected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

const severeImpact = ({
  reportedCases,
  periodType,
  timeToElapse,
  totalHospitalBeds,
  region: { avgDailyIncomeInUSD, avgDailyIncomePopulation }
}) => {
  const infected = reportedCases * 50;
  const infectionsByRequestedTime = NofInfectedPeople(
    infected,
    periodType,
    timeToElapse
  );
  const severeCasesByRequestedTime = Math.trunc(
    0.15 * infectionsByRequestedTime
  );
  const hospitalBedsByRequestedTime = Math.trunc(
    totalHospitalBeds * 0.35 - severeCasesByRequestedTime
  );
  const casesForICUByRequestedTime = Math.trunc(
    0.05 * infectionsByRequestedTime
  );
  const casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * infectionsByRequestedTime
  );

  const dollarsInFlight = Math.trunc((
    infectionsByRequestedTime
    * avgDailyIncomeInUSD
    * avgDailyIncomePopulation) / timeToElapse);

  return {
    currentlyInfected: infected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

const covid19ImpactEstimator = (data) => ({
  data,
  impact: impact(data),
  severeImpact: severeImpact(data)
});


export default covid19ImpactEstimator;
