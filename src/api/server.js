import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import xmlParser from 'js2xmlparser';
import fs from 'fs';
import path from 'path';

import covid19ImpactEstimator from '../estimator';
// const xml2js = require('xml2js');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logged.txt'), {
  flags: 'a'
});


const app = express();

app.use(morgan('tiny'));


// morgan.token('response', (req, res) => {
//   // eslint-disable-next-line no-underscore-dangle
//   if (!res._header || !req._startAt) return '';
//   // eslint-disable-next-line no-underscore-dangle
//   const diff = process.hrtime(req._startAt);
//   let ms = diff[0] * 1e3 + diff[1] * 1e-6;
//   ms = ms.toFixed(0);
//   return `${ms.toString().padStart(2, '0')}ms`;
// });

app.use(
  morgan(':method # :url # :status # :response-time # ms', {
    stream: accessLogStream
  })
);

app.use(bodyParser.json());

// const builder = xml2js.Builder();

const port = process.env.PORT || 4000;

app.post('/api/v1/on-covid-19/', (req, res, next) => {
  const estimateData = covid19ImpactEstimator(req.body);
  res.json(estimateData);
  next();
});

app.post('/api/v1/on-covid-19/json', (req, res, next) => {
  const estimateData = covid19ImpactEstimator(req.body);
  res.status(200).json({
    estimateData
  });
  next();
});

app.post('/api/v1/on-covid-19/xml', (req, res, next) => {
  let estimateData = covid19ImpactEstimator(req.body);
  estimateData = xmlParser.parse('result', estimateData);
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(estimateData);
  next();
});

app.post('/api/v1/on-covid-19/logs', (req, res, next) => {
  fs.readFile('logged.txt', 'utf-8', (err, data) => {
    let lines = data.split('\n');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < lines.length - 1; i++) {
      let line = lines[i].split(' # ');
      line[3] = Math.round(line[3]);
      line[3] = line[3] < 10 ? `0${line[3]}` : line[3];
      const spaceOne = 7 - line[0].length;
      const spaceTwo = 28 - line[1].length;
      const spaceThree = 4;
      line = `${line[0]}${' '.repeat(spaceOne)} ${line[1]}${' '.repeat(spaceTwo)} ${line[2]}${' '.repeat(spaceThree)} ${line[3]}${line[4]}`;
      lines[i] = line;
    }
    lines = lines.join('\n');
    res.type('text/plain').send(lines);
  });
  next();
});


app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on PORT ${port}`);
});
