const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger')
const BugsService = require('./bugs-service');
const { getBugValidationError } = require('./bug-validator');

const bugsRouter = express.Router();
const jsonParser = express.json();

const serializeBugs = bug => ({
  bug_id: bug.bug_id,
  bug_name: xss(bug.bug_name),
  application_id: bug.application_id,
  ticket_number: xss(bug.ticket_number),
  priority: xss(bug.priority),
  status: xss(bug.status),
  environment: xss(bug.environment),
  notes: xss(bug.notes),
  reported_by: xss(bug.reported_by),
  reported_on: bug.reported_on,
  expected_result: xss(bug.expected_result),
  actual_result: xss(bug.actual_result),
  developer: xss(bug.developer),
  developer_notes: xss(bug.developer_notes),
  last_updated: bug.last_updated,
})

const serializeSteps = step => ({
  steps_id: step.steps_id,
  bug_id: step.bug_id,
  steps_number: step.steps_number,
  steps: step.step
})

bugsRouter
  .route('/')

  .get((req, res, next) => {
    BugsService.getAllBugs(req.app.get('db'))
      .then(bugs => {
        res.json(bugs.map(serializeBugs))
      })
      .catch(next)
  })

  .post(jsonParser, (req, res, next) => {
    const {
      bug_name, application_id, ticket_number, priority, status, environment, notes, reported_by, reported_on, expected_result, actual_result, developer, developer_notes, last_updated
    } = req.body

    const newBug = {
      bug_name, application_id, ticket_number, priority, status
    };

    const numberOfValues = Object.values(newBug).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain a bug name, application, ticket_number, priority and status`
        }
      })
    }

    newBug.environment = environment;
    newBug.notes = notes;
    newBug.reported_by = reported_by;
    newBug.reported_on = reported_on;
    newBug.expected_result = expected_result;
    newBug.actual_result = actual_result;
    newBug.developer = developer;
    newBug.developer_notes = developer_notes;
    newBug.last_updated = last_updated;

    const error = getBugValidationError(newBug);

    if (error) return res.status(400).send(error);

    BugsService.insertBug(
      req.app.get('db'),
      newBug
    )
      .then(bug => {
        logger.info(`Bugs with id ${bug.bug_id} created.`)
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${bug.bug_id}`))
          .json(serializeBugs(bug))
      })
      .catch(next)

  })

bugsRouter
  .route('/:bug_id')

  .all((req, res, next) => {
    BugsService.getById(
      req.app.get('db'),
      req.params.bug_id
    )
      .then(bug => {
        if (!bug) {
          return res.status(404).json({
            error: { message: 'Bug Not Found' }
          })
        }
        res.bug = bug
        next()
      })
      .catch()
  })

  .get((req, res) => {
    res.json(serializeBugs(res.bug))
  })

  .delete( (req, res, next) => {
    BugsService.deleteBug(
      req.app.get('db'),
      req.params.bug_id
    )
      .then( () => {
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(jsonParser, (req, res, next) => {
    const {
      bug_name, application_id, ticket_number, priority, status, environment, notes, reported_by, reported_on, expected_result, actual_result, developer, developer_notes, last_updated
    } = req.body

    const bugToUpdate = {
      bug_name, application_id, ticket_number, priority, status
    };

    const numberOfValues = Object.values(bugToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain a bug name, application, ticket_number, priority and status`
        }
      })
    }

    bugToUpdate.environment = environment;
    bugToUpdate.notes = notes;
    bugToUpdate.reported_by = reported_by;
    bugToUpdate.reported_on = reported_on;
    bugToUpdate.expected_result = expected_result;
    bugToUpdate.actual_result = actual_result;
    bugToUpdate.developer = developer;
    bugToUpdate.developer_notes = developer_notes;
    bugToUpdate.last_updated = last_updated;

    const error = getBugValidationError(bugToUpdate);

    if (error) return res.status(400).send(error);

    BugsService.updateBug(
      req.app.get('db'),
      req.params.bug_id,
      bugToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)

  })


module.exports = bugsRouter;