const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const axios = require('axios');
// const qs = require('qs');
// const jwt_decode = require('jwt-decode');
// const bodyParser = require('body-parser');
// const https = require('https');

require('dotenv').config();
const ServerAuth = require('./services/utils/ServerAuth');
const accountsRoute = require('./routes/Accounts');
const adminRoute = require('./routes/Admin');

const app = express();
app.use(express.json());

const port = process.env.PORT || 5002;

const apiPrefix = '/api';

// Set access tokens when server starts
ServerAuth.setServerAdminAccessToken();
ServerAuth.setServerSystemAccessToken();

// Refresh access token about 3 min before it expires
const checkServerAuth = setInterval(() => {
  ServerAuth.checkServerAuth();
}, 60000);

app.use(cors());
app.use(morgan('combined'));

app.use(apiPrefix + '/accounts', accountsRoute);
app.use(apiPrefix + '/admin', adminRoute);

app.get('/', (req, res) => {
  res.send('Service is alive');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
