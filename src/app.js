require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { CLIENT_ORIGIN } = require('./config');
const errorHandler = require('./error-handler');
const applicationsRouter = require('./applications/applications-router');
const bugsRouter = require('./bugs/bugs-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

const app = express();

app.use(morgan((CLIENT_ORIGIN === 'production') ? 'tiny' : 'common', {
  skip: () => CLIENT_ORIGIN === 'test',
}))
app.use(cors());
app.use(helmet());


app.use('/api/applications', applicationsRouter);
app.use('/api/bugs', bugsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.json({ok: true});
});

/* Error handling */
app.use(errorHandler);

module.exports = app;