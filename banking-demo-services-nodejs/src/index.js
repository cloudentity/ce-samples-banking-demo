const express = require('express');
const axios = require('axios');
const qs = require('qs');
const jwt_decode = require('jwt-decode');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const port = 5002;
const apiPrefix = '/api';
require('dotenv').config();

const accountsDataFile = fs.readFileSync(path.resolve(__dirname, 'data/accounts-data.json'));
const accountsData = JSON.parse(accountsDataFile);

const balancesDataFile = fs.readFileSync(path.resolve(__dirname, 'data/balances-data.json'));
const balancesData = JSON.parse(balancesDataFile);

const transactionsDataFile = fs.readFileSync(path.resolve(__dirname, 'data/transactions-data.json'));
const transactionsData = JSON.parse(transactionsDataFile);

// TODO: protect API endpoints with ACP

app.get(apiPrefix + '/accounts', (req, res) => {
  res.send(accountsData);
});

app.get(apiPrefix + '/balances', (req, res) => {
  res.send(balancesData);
});

app.get(apiPrefix + '/transactions', (req, res) => {
  res.send(transactionsData);
});

app.get('/', (req, res) => {
  res.send('Service is alive');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
