const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger')
const BugsService = require('./bugs-service');
const StepsService = require('./steps-service');
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
  last_updated: bug.last_updated
})

const serializeSteps = step => ({
  steps_id: step.steps_id,
  bug_id: step.bug_id,
  steps_number: step.steps_number,
  step: xss(step.step)
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
        console.log('.all Bug', res.bug)
      })

      .then(StepsService.getAllSteps(
        req.app.get('db'),
        req.params.bug_id,
      )
        .then(steps => {
          if (!steps) {
            return res.status(404).json({
              error: { message: 'Steps Not Found' }
            })
          }
          res.steps = steps
          console.log('.all Steps', res.steps)
        }))
      .next()
      .catch()
  })

  .get((req, res) => {
    console.log('.get Bug', res.bug)
    console.log('.get Steps', res.steps)
    res.json(serializeBugs(res.bug))
    res.json(res.steps.map(serializeSteps))
  })


module.exports = bugsRouter;