'use strict';

const AcpApiService = require('./api/AcpApiService');
const ErrorService = require('./utils/ErrorService');

class AdminService {

  changeUserWithdrawalLimit (serverToken, userId, data) {
    // TODO: token exchange flow
    // return AcpApiService...
    return Promise.resolve({});
  }
}

module.exports = new AdminService();
