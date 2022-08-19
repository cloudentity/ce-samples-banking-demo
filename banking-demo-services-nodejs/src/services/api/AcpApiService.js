'use strict';

const axios = require('axios');
const qs = require('qs');

const acpBaseUrl = `https://${process.env.ACP_HOST}${process.env.ACP_PORT ? ':' + process.env.ACP_PORT : ''}`;
const acpOauth2Url = `${acpBaseUrl}/${process.env.ACP_TENANT_ID}/${process.env.ACP_AUTHORIZATION_SERVER_ID}/oauth2`;

class AcpApiService {

  token (data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(data),
      url: acpOauth2Url + '/token',
    };

    console.log('PRE-URL-ENCODED BODY:')
    console.log(data)

    console.log('URL-ENCODED REQUEST (CAN BE PASTED INTO POSTMAN):')
    console.log(options);

    return axios(options);
  }

  introspectToken (userToken, serverToken) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${serverToken}`
      },
      data: qs.stringify({token: userToken}),
      url: acpOauth2Url + '/introspect',
    };

    return axios(options);
  }
}

module.exports = new AcpApiService();
