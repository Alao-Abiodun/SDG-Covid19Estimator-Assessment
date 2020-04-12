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

export default covid19ImpactEstimator;
