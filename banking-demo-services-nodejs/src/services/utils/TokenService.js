'use strict';

const fs = require('fs');
const jose = require('node-jose');

const acpUrl = `https://${process.env.ACP_HOST}/${process.env.ACP_TENANT_ID}/${process.env.ACP_AUTHORIZATION_SERVER_ID}/oauth2/token`;

class TokenService {

  async generateToken (sub) {
    const ksFile = fs.readFileSync('keys.json');
    const keyStore = await jose.JWK.asKeyStore(ksFile.toString());

    const [key] = keyStore.all({use: 'sig'});

    const opt = {compact: true, jwk: key, fields: {typ: 'jwt'}};

    const payload = JSON.stringify({
      iss: '12345',
      sub: sub,
      aud: acpUrl,
      exp: Math.floor((Date.now() + 86400000) / 1000),
      iat: Math.floor(Date.now() / 1000),
      jti: Math.random().toString().substr(2, 8)
    });

    const token = await jose.JWS.createSign(opt, key).update(payload).final();

    return token;
  }
}

module.exports = new TokenService();
