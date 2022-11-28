'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const ServerAuth = require('../services/utils/ServerAuth');
const AdminService = require('../services/AdminService');
const ErrorService = require('../services/utils/ErrorService');

const usersDataFile = fs.readFileSync(path.resolve(__dirname, '../data/users-data.json'));
let usersData = JSON.parse(usersDataFile);

const updateUsersData = newData => {
  return usersData.map(u => {
    if (u.email === newData.identifier) {
      return {...u, withdrawalLimit: newData.withdrawalLimitAmount};
    }
    return u;
  });
};

router.get('/users', (req, res) => {
  res.send(usersData);
});

router.post('/verify-scopes', (req, res) => {
  const adminAccessToken = req.headers?.authorization?.split(' ')[1];

  AdminService.verifyAdminScopes(adminAccessToken, req.body?.scopes)
    .then(verifyScopesRes => {
      res.status(200);
      res.send(JSON.stringify(verifyScopesRes));
    })
    .catch(err => {
      ErrorService.sendErrorResponse(err, res);
    });
});

router.post('/change-user-withdrawal-limit', (req, res) => {
  const adminAccessToken = req.headers?.authorization?.split(' ')[1];

  AdminService.changeUserWithdrawalLimit(adminAccessToken, req.body?.identifier, req.body?.withdrawalLimitAmount)
    .then(changeLimitRes => {
      usersData = updateUsersData(req.body || {});
      res.status(200);
      res.send(JSON.stringify(changeLimitRes));
    })
    .catch(err => {
      ErrorService.sendErrorResponse(err, res);
    });
});

module.exports = router;
