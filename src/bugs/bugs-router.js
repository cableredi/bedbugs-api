const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger')
const BugsService = require('./bugs-service');
const { getBugValidationError } = require('./bug-validator');

const bugRouter = express.Router();
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
  report_by: xss(bug.report_by),
  reported_on: bug.reported_on,
  expected_result: xss(bug.expected_result),
  actual_result: xss(bug.actual_result),
  developer: xss(bug.developer),
  developer_notes: xss(bug.developer_notes),
  last_updated: last_updated
})

const serializeSteps = step ({
  step_id: step.step_id,
  bug_id: step.bug_id,
  steps_number: step.steps_number,
  step: step.step
})

bugsRouter
  .route('/')

  .get((req, res, next) => {
    ApplicationsService.getAllBugs(req.app.get('db'))
      .then(applications => {
        res.json(applications.map(serializeApplications))
      })
      .catch(next)
  })

module.exports = applicationsRouter;