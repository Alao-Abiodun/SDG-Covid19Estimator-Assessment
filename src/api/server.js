import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import xml from 'xml';
// const xml2js = require('xml2js');

import covid19ImpactEstimator from '../estimator';

const app = express();

app.use(morgan('tiny'));

const loggedStream = fs.createWriteStream(
  path.join(__dirname, 'access.txt'),
  { flags: 'a', encoding: 'utf8' }
);

morgan.token('response', (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  if (!res._header || !req._startAt) return '';
  // eslint-disable-next-line no-underscore-dangle
  const diff = process.hrtime(req._startAt);
  let ms = diff[0] * 1e3 + diff[1] * 1e-6;
  ms = ms.toFixed(0);
  return `${ms.toString().padStart(2, '0')}ms`;
});

app.use(
  morgan(':method :url :status :response\n', {
    stream: loggedStream
  })
);

app.use(bodyParser.json());

// const builder = xml2js.Builder();

const port = 4000 || process.env.PORT;

app.get('/api/v1/on-covid-19/logs', (req, res, next) => {
  const dataInput = fs.readFileSync(path.join(__dirname, './logged.txt'), { encoding: 'utf-8' });
  res.format({
    // eslint-disable-next-line func-names
    'text/plain': function () {
      res.status(200).send(dataInput);
    }
  });
  next();
});

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
  res.status(200).send(xml(estimateData));
  next();
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on PORT ${port}`);
});
