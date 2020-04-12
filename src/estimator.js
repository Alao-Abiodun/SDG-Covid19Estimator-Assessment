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

const estimatorTracker = (data, value) => {
  const infected = data.reportedCases * value;
  const infectionsByRequestedTime = NofInfectedPeople(
    infected,
    data.periodType,
    data.timeToElapse
  );
  const severeCasesByRequestedTime = Math.trunc(
    0.15 * infectionsByRequestedTime
  );
  const hospitalBedsRequestedTime = Math.trunc(
    data.totalHospitalBeds * 0.35 - severeCasesByRequestedTime
  );
  const casesForICUByRequestedTime = Math.trunc(
    0.05 * severeCasesByRequestedTime
  );
  const casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * severeCasesByRequestedTime
  );
  const dollarsInFlight = Math.trunc((infectionsByRequestedTime
    * data.region.avgDailyIncomeInUSD
    * data.region.avgDailyIncomePopulation)
    / data.timeToElapse);
  return {
    currentlyInfected: infected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

const covid19ImpactEstimator = (data) => ({
  data,
  impact: estimatorTracker(data, 10),
  severeImpact: estimatorTracker(data, 50)
});

const data = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};

// eslint-disable-next-line no-console
console.log(covid19ImpactEstimator(data));

// export default covid19ImpactEstimator;
