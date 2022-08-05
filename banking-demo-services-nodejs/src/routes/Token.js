'use strict';

const express = require('express');
const router = express.Router();
const TokenService = require('../services/utils/TokenService');
const AcpApiService = require('../services/api/AcpApiService');

router.get('/', async (req, res) => {
  const token = await TokenService.generateToken('example');

  res.send({ token });
});

module.exports = router;
