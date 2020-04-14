import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
// const xml2js = require('xml2js');

import covid19ImpactEstimator from '../estimator';

const app = express();

app.use(morgan('tiny'));

app.use(bodyParser.json());

// const builder = xml2js.Builder();

const port = 4000 || process.env.PORT;

app.post('/api/v1/on-covid-19/', (req, res, next) => {
  const {
    region: {
      name, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation
    }, periodType, timeToElapse, reportedCases, population, totalHospitalBeds
  } = req.body;
  const inputData = {
    region: {
      name, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation
    },
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  };
  const estimateData = covid19ImpactEstimator(inputData);
  res.status(200).send(estimateData);
  next();
});

app.post('/api/v1/on-covid-19/json', (req, res, next) => {
  const {
    region: {
      name, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation
    }, periodType, timeToElapse, reportedCases, population, totalHospitalBeds
  } = req.body;
  const inputData = {
    region: {
      name, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation
    },
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  };
  const estimateData = covid19ImpactEstimator(inputData);
  res.status(200).json({
    estimateData
  });
  next();
});

app.post('/api/v1/on-covid-19/xml', (req, res, next) => {
  const {
    region: {
      name, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation
    }, periodType, timeToElapse, reportedCases, population, totalHospitalBeds
  } = req.body;
  const inputData = {
    region: {
      name, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation
    },
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  };
  const estimateData = covid19ImpactEstimator(inputData);
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(estimateData);
  next();
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on PORT ${port}`);
});
