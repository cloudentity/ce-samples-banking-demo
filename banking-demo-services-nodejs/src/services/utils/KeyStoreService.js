'use strict';

const fs = require('fs');
const jose = require('node-jose');

const keyStore = jose.JWK.createKeyStore();

class KeyStoreService {

  generateKeys () {
    keyStore.generate('RSA', 2048, {alg: 'RS256', use: 'sig'})
      .then(result => {
        fs.writeFileSync(
          'keys.json',
          JSON.stringify(keyStore.toJSON(true), null, ' ')
        );
      });
  }
}

module.exports = new KeyStoreService();
