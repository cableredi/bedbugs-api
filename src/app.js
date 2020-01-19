require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { CLIENT_ORIGIN } = require('./config');

const app = express();

const PORT = process.env.PORT || 3000;

const morganOption = (CLIENT_ORIGIN === 'production')
  ? 'tiny'
  : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors({
  origin: CLIENT_ORIGIN
}));

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

/* Error handling */
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (CLIENT_ORIGIN === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
})

module.exports = app;