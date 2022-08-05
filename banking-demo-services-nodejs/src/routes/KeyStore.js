'use strict';

const fs = require('fs');
const jose = require('node-jose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const ksFile = fs.readFileSync('keys.json');
  const keyStore = await jose.JWK.asKeyStore(ksFile.toString());

  res.send(keyStore.toJSON());
});

module.exports = router;
