'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const ServerAuth = require('../services/utils/ServerAuth');
const AdminService = require('../services/AdminService');

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

router.post('/change-user-withdrawal-limit', (req, res) => {
  AdminService.changeUserWithdrawalLimit(ServerAuth.getServerSystemAccessToken(), req.body?.identifier, req.body?.withdrawalLimitAmount)
    .then(changeLimitRes => {
      usersData = updateUsersData(req.body || {});
      res.status(200);
      res.send(JSON.stringify({}));
    })
    .catch(err => {
      ErrorService.sendErrorResponse(err, res);
    });
});

module.exports = router;
