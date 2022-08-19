'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const accountsDataFile = fs.readFileSync(path.resolve(__dirname, '../data/accounts-data.json'));
const accountsData = JSON.parse(accountsDataFile);

const balancesDataFile = fs.readFileSync(path.resolve(__dirname, '../data/balances-data.json'));
const balancesData = JSON.parse(balancesDataFile);

const transactionsDataFile = fs.readFileSync(path.resolve(__dirname, '../data/transactions-data.json'));
const transactionsData = JSON.parse(transactionsDataFile);

router.get('/', (req, res) => {
  res.send(accountsData);
});

router.get('/balances', (req, res) => {
  res.send(balancesData);
});

router.get('/transactions', (req, res) => {
  res.send(transactionsData);
});

router.post('/transfer', (req, res) => {
  res.send('null');
  res.status(201).end();
  // res.status(403);
  // res.json({
  //   error: 'Request.Unauthorized',
  //   message: 'The request was rejected as unauthorized'
  // });
});

module.exports = router;
