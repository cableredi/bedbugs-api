function makeApplicationsArray() {
  return [
    {
      "application_id": 1,
      "application_name": "Application 1",
      "application_url": "https://www.application1.com",
      "repository_prod": "https://github.com/company/application1",
      "repository_test": "https://github.com/company-test/application1",
      "database_prod": "application1proddb",
      "database_test": "application1testdb",
    },
    {
      "application_id": 2,
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
      "environment": "Chrome version 3.2, Windows 10",
      "notes": "Was messing around and got the wrong face",
      "reported_by": "Gimli",
      "reported_on": "2015-03-25T12:00:00-06:30",
      "expected_result": "Smiley face",
      "actual_result": "Sad Face",
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
      "environment": "Chrome version 3.2, Windows 10",
      "notes": "Shot the arrow but something weird happened",
      "reported_by": "Gimli",
      "reported_on": "2015-04-25T12:00:00-06:30",
      "expected_result": "Arrow shot over the mountain",
      "actual_result": "Arrow shot through the mountain",
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
      "environment": "Chrome version 3.2, Windows 10",
      "notes": "just crashed",
      "reported_by": "Frodo",
      "reported_on": "2015-05-25T12:00:00-06:30",
      "expected_result": "Page to displayn",
      "actual_result": "Not Found error",
      "developer": "Samwise",
      "developer_notes": "maybe smeagal took it",
      "last_updated": "2015-05-27T12:00:00-06:30"
    },
  ]
};

function makeExpectedBug() {
  return [
    {
      "bug_id": 1,
      "bug_name": "Bug 1",
      "application_id": 1,
      "ticket_number": "14538",
      "priority": "High",
      "status": "In-Progress",
      "environment": "Chrome version 3.2, Windows 10",
      "notes": "Was messing around and got the wrong face",
      "reported_by": "Gimli",
      "reported_on": "2015-03-25T12:00:00-06:30",
      "expected_result": "Smiley face",
      "actual_result": "Sad Face",
      "developer": "Frodo",
      "developer_notes": "working on it",
      "last_updated": "2015-03-27T12:00:00-06:30"
    }
  ]
};

function makeStepsArray() {
  return [
    {
      "steps_id": 1,
      "bug_id": 1,
      "steps_number": 1,
      "step": "This is step 1"
    },
    {
      "steps_id": 2,
      "bug_id": 1,
      "steps_number": 2,
      "step": "This is step 2"
    },
    {
      "steps_id": 3,
      "bug_id": 2,
      "steps_number": 1,
      "step": "This is step 1"
    },
    {
      "steps_id": 4,
      "bug_id": 2,
      "steps_number": 2,
      "step": "This is step 2"
    },
    {
      "steps_id": 5,
      "bug_id": 2,
      "steps_number": 3,
      "step": "This is step 3"
    },
    {
      "steps_id": 6,
      "bug_id": 2,
      "steps_number": 4,
      "step": "This is step 4"
    },
    {
      "steps_id": 7,
      "bug_id": 3,
      "steps_number": 1,
      "step": "This is step 1"
    }
  ]
};

function makeExpectedSteps() {
  return [
    {
      "steps_id": 1,
      "bug_id": 1,
      "steps_number": 1,
      "step": "This is step 1"
    },
    {
      "steps_id": 2,
      "bug_id": 1,
      "steps_number": 2,
      "step": "This is step 2"
    },
  ]
}

  module.exports = {
    makeApplicationsArray,
    makeExpectedApplication,
    makeBugsArray,
    makeExpectedBug,
    makeStepsArray,
    makeExpectedSteps,
  }