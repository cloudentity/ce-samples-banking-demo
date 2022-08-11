'use strict';

const AcpApiService = require('./api/AcpApiService');
const TokenService = require('./utils/TokenService');
const ErrorService = require('./utils/ErrorService');

class AdminService {

  changeUserWithdrawalLimit (adminToken, userId, data) {

    return TokenService.generateToken(userId)
      .then(jwt => {
        return AcpApiService.token({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
          client_id: process.env.USER_TOKEN_MINTING_OAUTH_CLIENT_ID,
          client_secret: process.env.USER_TOKEN_MINTING_OAUTH_CLIENT_SECRET
        })
        .then(mintUserAccessTokenRes => {
          return AcpApiService.token({
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            client_id: process.env.USER_TOKEN_MINTING_OAUTH_CLIENT_ID,
            client_secret: process.env.USER_TOKEN_MINTING_OAUTH_CLIENT_SECRET,
            subject_token: mintUserAccessTokenRes?.data?.access_token,
            actor_token: adminToken,
            actor_token_type: 'urn:ietf:params:oauth:token-type:access_token',
            scope: 'profile'
          })
          .then(tokenExchangeRes => {
            const finalResponse = {
              subject_access_token: mintUserAccessTokenRes?.data?.access_token || '',
              token_exchange_access_token: tokenExchangeRes?.data?.access_token || ''
            }
            return Promise.resolve(finalResponse);
          })
          .catch(tokenExchangeErr => ErrorService.handleAcpApiError(tokenExchangeErr));
        })
        .catch(mintUserAccessTokenErr => ErrorService.handleAcpApiError(mintUserAccessTokenErr));
      })
  }
}

module.exports = new AdminService();
