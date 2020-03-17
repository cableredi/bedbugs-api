const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      user_id: 1,
      user_name: 'test-user-1',
      first_name: 'user first 1',
      last_name: 'user last 1',
      password: '$2a$12$YslIk77V5HvK2BG4Rzw57OMm1sTx0ssMCURA6njiYO.SohOgAAc7y',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    }
  ]
};

function makeApplicationsArray() {
  return [
    {
      "application_id": 1,
      "user_id": 1,
      "application_name": "Application 1",
      "application_url": "https://www.application1.com",
      "repository_prod": "https://github.com/company/application1",
      "repository_test": "https://github.com/company-test/application1",
      "database_prod": "application1proddb",
      "database_test": "application1testdb",
    },
    {
      "application_id": 2,
      "user_id": 1,
      "application_name": "Application 2",
      "application_url": "https://www.application2.com",
      "repository_prod": "https://github.com/company/application2",
      "repository_test": "https://github.com/company-test/application2",
      "database_prod": "application2proddb",
      "database_test": "application2testdb",
    },
  ]
};

function makeExpectedApplication() {
  return {
    "application_id": 2,
    "user_id": 1,
    "application_name": "Application 2",
    "application_url": "https://www.application2.com",
    "repository_prod": "https://github.com/company/application2",
    "repository_test": "https://github.com/company-test/application2",
    "database_prod": "application2proddb",
    "database_test": "application2testdb",
  }
}

function makeBugsArray() {
  return [
    {
      "bug_id": 1,
      "bug_name": "Bug 1",
      "application_id": 1,
      "ticket_number": "14538",
      "priority": "High",
      "status": "In-Progress",
      "environment": "Test",
      "notes": "Was messing around and got the wrong face",
      "reported_by": "Gimli",
      "reported_on": "2015-03-25T12:00:00-06:30",
      "expected_result": "Smiley face",
      "actual_result": "Sad Face",
      "steps": "This is the steps for Bug 1",
      "developer": "Frodo",
      "developer_notes": "working on it",
      "last_updated": "2015-03-27T12:00:00-06:30"
    },
    {
      "bug_id": 2,
      "bug_name": "Bug 2",
      "application_id": 2,
      "ticket_number": "19088",
      "priority": "High",
      "status": "In-Progress",
      "environment": "Pre-Production",
      "notes": "Shot the arrow but something weird happened",
      "reported_by": "Gimli",
      "reported_on": "2015-04-25T12:00:00-06:30",
      "expected_result": "Arrow shot over the mountain",
      "actual_result": "Arrow shot through the mountain",
      "steps": "This is the steps for Bug 2",
      "developer": "Samwise",
      "developer_notes": "working on it",
      "last_updated": "2015-04-27T12:00:00-06:30"
    },
    {
      "bug_id": 3,
      "bug_name": "Bug 3",
      "application_id": 1,
      "ticket_number": "16738",
      "priority": "Low",
      "status": "Open",
      "environment": "Production",
      "notes": "just crashed",
      "reported_by": "Frodo",
      "reported_on": "2015-05-25T12:00:00-06:30",
      "expected_result": "Page to displayn",
      "actual_result": "Not Found error",
      "steps": "This is the steps for Bug 3",
      "developer": "Samwise",
      "developer_notes": "maybe smeagal took it",
      "last_updated": "2015-05-27T12:00:00-06:30"
    },
  ]
};

function makeExpectedBug() {
  return {
    "bug_id": 1,
    "bug_name": "Bug 1",
    "application_id": 1,
    "ticket_number": "14538",
    "priority": "High",
    "status": "In-Progress",
    "environment": "Test",
    "notes": "Was messing around and got the wrong face",
    "reported_by": "Gimli",
    "reported_on": "2015-03-25T12:00:00-06:30",
    "expected_result": "Smiley face",
    "actual_result": "Sad Face",
    "steps": "This is the steps for Bug 1",
    "developer": "Frodo",
    "developer_notes": "working on it",
    "last_updated": "2015-03-25T12:00:00-06:30"
  }
};

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.user_id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  
  return `Bearer ${token}`
};


module.exports = {
  makeUsersArray,
  makeApplicationsArray,
  makeExpectedApplication,
  makeBugsArray,
  makeExpectedBug,
  makeAuthHeader,
}