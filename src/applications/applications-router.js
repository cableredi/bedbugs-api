const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger')
const ApplicationsService = require('./applications-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { getApplicationValidationError } = require('./application-validator');

const applicationsRouter = express.Router();
const jsonParser = express.json();

const serializeApplications = application => ({
  application_id: application.application_id,
  user_id: application.user_id,
  application_name: xss(application.application_name),
  application_url: application.application_url,
  repository_prod: xss(application.repository_prod),
  repository_test: xss(application.repository_test),
  database_prod: xss(application.database_prod),
  database_test: xss(application.database_test),
})

applicationsRouter
  .route('/')

  .get(requireAuth, (req, res, next) => {    
    ApplicationsService.getAllApplications(
      req.app.get('db'),
      req.user.user_id
    )
      .then(applications => {
        res.json(applications.map(serializeApplications))
      })
      .catch(next)
  })

  .post(requireAuth, jsonParser, (req, res, next) => {
    const {
      application_name, application_url, repository_prod, repository_test, database_prod, database_test, user_id
    } = req.body

    const newApplication = {
      application_name, application_url, repository_prod, repository_test, database_prod, database_test, user_id
    };

    for (const field of ['application_name', 'application_url']) {
      if (!newApplication[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send({
          error: { message: `Missing '${field}' in request body` }
        })
      }
    };

    newApplication.user_id = req.user.user_id;

    const error = getApplicationValidationError(newApplication);

    if (error) return res.status(400).send(error);

    ApplicationsService.insertApplication(
      req.app.get('db'),
      newApplication
    )
    .then(application => {
      logger.info(`Applications with id ${application.application_id} created.`)
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${application.application_id}`))
        .json(serializeApplications(application))
    })
    .catch(next)

  })

applicationsRouter
  .route('/:application_id')
  .all(requireAuth)

  .all((req, res, next) => {
    ApplicationsService.getById(
      req.app.get('db'),
      req.params.application_id
    )
      .then(application => {
        if (!application) {
          return res.status(404).json({
            error: { message: 'Application Not Found' }
          })
        }
        res.application = application
        next()
      })
      .catch(next)
  })

  .get((req, res) => {
    res.json(serializeApplications(res.application))
  })

  .delete( (req, res, next) => {
    ApplicationsService.deleteApplication(
      req.app.get('db'),
      req.params.application_id
    )
      .then( () => {
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(jsonParser, (req, res, next) => {
    const {
      application_name, application_url, repository_prod, repository_test, database_prod, database_test
    } = req.body

    const applicationToUpdate = {
      application_name, application_url
    };

    const numberOfValues = Object.values(applicationToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain a application name and application url`
        }
      })
    }

    applicationToUpdate.repository_prod = repository_prod;
    applicationToUpdate.repository_test = repository_test;
    applicationToUpdate.database_prod = database_prod;
    applicationToUpdate.database_test = database_test;

    ApplicationsService.updateApplication(
      req.app.get('db'),
      req.params.application_id,
      applicationToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)

  })

module.exports = applicationsRouter;