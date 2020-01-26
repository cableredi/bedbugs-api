const logger = require('../logger')

const NO_ERRORS = null

function getBugValidationError({ priority, status, environment }) {
  if (priority && 
    (priority !== 'High' && priority !== 'Medium' && priority !== 'Low')) {
    logger.error(`Priority must be either High, Medium, or Low`)
    return {
      error: {
        message: `'priority' must be a valid priorty`
      }
    }
  }

  if (status && 
    (status !== 'Open' && status !== 'In-Progress' && status !== 'Closed')) {
    logger.error(`status must be either Open, In-Progress or Closed`)
    return {
      error: {
        message: `'status' must be a valid status`
      }
    }
  }

  if (environment && 
    (environment !== 'Test' && environment !== 'QA' && environment !== 'Pre-Production' && environment !== 'Production')) {
    logger.error(`status must be either Test, QA, Pre-Production, or Production`)
    return {
      error: {
        message: `'environment' must be a valid environment`
      }
    }
  }

  return NO_ERRORS
}

module.exports = {
  getBugValidationError,
}