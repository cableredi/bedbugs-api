const knex = require('knex');
const fixtures = require('./bedbugs-fixtures');
const app = require('../src/app');

describe('Bugs Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
    db.raw('TRUNCATE bugs, applications RESTART IDENTITY CASCADE')
  });

  afterEach('cleanup', () => db.raw('TRUNCATE bugs, applications RESTART IDENTITY CASCADE'));

  after('disconnect from db', () => db.destroy())

  describe('GET /api/bugs', () => {
    context(`Given no bugs`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/bugs')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('Given there are bugs in the database', () => {
      const testApplications = fixtures.makeApplicationsArray()
      const testBugs = fixtures.makeBugsArray()

      beforeEach('insert application', () => {
        return db
          .into('applications')
          .insert(testApplications)
      })

      beforeEach('insert bugs', () => {
        return db
          .into('bugs')
          .insert(testBugs)
      })

      it('gets the bugs from database', () => {
        return supertest(app)
          .get('/api/bugs')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(res => {
            for (let i = 0; i < testBugs.length; i++) {
              expect(res.body[i].bug_name).to.eql(testBugs[i].bug_name)
              expect(res.body[i].application_id).to.eql(testBugs[i].application_id)
              expect(res.body[i].ticket_number).to.eql(testBugs[i].ticket_number)
              expect(res.body[i].priority).to.eql(testBugs[i].priority)
              expect(res.body[i].status).to.eql(testBugs[i].status)
              expect(res.body[i].environment).to.eql(testBugs[i].environment)
              expect(res.body[i].notes).to.eql(testBugs[i].notes)
              expect(res.body[i].reported_by).to.eql(testBugs[i].reported_by)
              expect(res.body[i].reported_on.substring(0, 9)).to.eql(testBugs[i].reported_on.substring(0, 9))
              expect(res.body[i].expected_result).to.eql(testBugs[i].expected_result)
              expect(res.body[i].actual_result).to.eql(testBugs[i].actual_result)
              expect(res.body[i].steps).to.eql(testBugs[i].steps)
              expect(res.body[i].developer).to.eql(testBugs[i].developer)
              expect(res.body[i].developer_notes).to.eql(testBugs[i].developer_notes)
              expect(res.body[i].last_updated.substring(0, 9)).to.eql(testBugs[i].last_updated.substring(0, 9))
              expect(res.body[i]).to.have.property('bug_id')
            }
          })
      })
    })
  })

  describe(`POST /api/bugs`, () => {
    const testApplications = fixtures.makeApplicationsArray()

    beforeEach('insert application', () => {
      return db
        .into('applications')
        .insert(testApplications)
    })

    it(`creates a bug responding with 201 and the new bug`, function () {
      this.retries(3)
      const newBug = {
        bug_id: 1,
        bug_name: "New new bug",
        application_id: 2,
        ticket_number: "14538",
        priority: "High",
        status: "In-Progress",
        environment: "environment",
        notes: "notes",
        reported_by: "me",
        reported_on: new Date(),
        expected_result: "expected",
        actual_result: "actual",
        steps: "this is a new step",
        developer: "another me",
        developer_notes: '',
        last_updated: new Date()
      }

      return supertest(app)
        .post('/api/bugs')
        .send(newBug)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect(res => {
          expect(res.body.bug_name).to.eql(newBug.bug_name)
          expect(res.body.application_id).to.eql(newBug.application_id)
          expect(res.body.ticket_number).to.eql(newBug.ticket_number)
          expect(res.body.priority).to.eql(newBug.priority)
          expect(res.body.status).to.eql(newBug.status)
          expect(res.body.environment).to.eql(newBug.environment)
          expect(res.body.notes).to.eql(newBug.notes)
          expect(res.body.reported_by).to.eql(newBug.reported_by)
          const expected = new Date().toLocaleString('en', { timeZone: 'UTC' })
          const actual = new Date(res.body.reported_on).toLocaleString()
          expect(actual).to.eql(expected)
          expect(res.body.expected_result).to.eql(newBug.expected_result)
          expect(res.body.actual_result).to.eql(newBug.actual_result)
          expect(res.body.steps).to.eql(newBug.steps)
          expect(res.body.developer).to.eql(newBug.developer)
          expect(res.body).to.have.property('bug_id')
          expect(res.headers.location).to.eql(`/api/bugs/${res.body.bug_id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/bugs/${res.body.bug_id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body)
        )
    });
  });


  describe('GET /api/bugs/:bug_id', () => {
    const testApplications = fixtures.makeApplicationsArray()
    const testBugs = fixtures.makeBugsArray()

    beforeEach('insert application', () => {
      return db
        .into('applications')
        .insert(testApplications)
    })

    beforeEach('insert bugs', () => {
      return db
        .into('bugs')
        .insert(testBugs)
    })

    it('responds with 200 and the specified bug', () => {
      const bug_id = 1;
      const expectedBug = fixtures.makeExpectedBug();

      return supertest(app)
        .get(`/api/bugs/${bug_id}`)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(res => {
          expect(res.body.bug_name).to.eql(expectedBug.bug_name)
          expect(res.body.application_id).to.eql(expectedBug.application_id)
          expect(res.body.ticket_number).to.eql(expectedBug.ticket_number)
          expect(res.body.priority).to.eql(expectedBug.priority)
          expect(res.body.status).to.eql(expectedBug.status)
          expect(res.body.environment).to.eql(expectedBug.environment)
          expect(res.body.notes).to.eql(expectedBug.notes)
          expect(res.body.reported_by).to.eql(expectedBug.reported_by)
          const expectedReportedOn = new Date(expectedBug.reported_on).getMonth() + new Date(expectedBug.reported_on).getDay() + new Date(expectedBug.reported_on).getFullYear()
          const actualReportedOn = new Date(res.body.reported_on).getMonth() + new Date(res.body.reported_on).getDay() + new Date(res.body.reported_on).getFullYear()
          expect(actualReportedOn).to.eql(expectedReportedOn)
          expect(res.body.expected_result).to.eql(expectedBug.expected_result)
          expect(res.body.actual_result).to.eql(expectedBug.actual_result)
          expect(res.body.steps).to.eql(expectedBug.steps)
          expect(res.body.developer).to.eql(expectedBug.developer)
          expect(res.body.developer_notes).to.eql(expectedBug.developer_notes)
          const expectedLatestUpdate = new Date(expectedBug.latest_date).getMonth() + new Date(expectedBug.latest_date).getDay() + new Date(expectedBug.latest_date).getFullYear()
          const actualLatestUpdate = new Date(res.body.latest_date).getMonth() + new Date(res.body.latest_date).getDay() + new Date(res.body.latest_date).getFullYear()
          expect(actualLatestUpdate).to.eql(expectedLatestUpdate)
          expect(res.body).to.have.property('bug_id')
        })
    })
  });

  describe(`PATCH /api/bugs/:bug_id`, () => {
    const testApplications = fixtures.makeApplicationsArray();
    const testBugs = fixtures.makeBugsArray()

    beforeEach('insert applications', () => {
      return db
        .into('applications')
        .insert(testApplications)
    })

    beforeEach('insert bugs', () => {
      return db
        .into('bugs')
        .insert(testBugs)
    })

    context(`Given no bugs`, () => {
      it(`responds with 404`, () => {
        const bug_id = 123456
        return supertest(app)
          .patch(`/api/bugs/${bug_id}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `Bug Not Found` } })
      })
    })

    context('Given there are bugs in the database', () => {
      it('responds with 204 and updates the bug', () => {
        const idToUpdate = 1
        const updateBug = {
          bug_id: 1,
          bug_name: "Updated Bug 1",
          application_id: 1,
          ticket_number: "new ticket number",
          priority: "High",
          status: "In-Progress",
          environment: "Chrome version 3.2, Windows 10",
          notes: "Was messing around and got the wrong face",
          reported_by: "Gimli",
          reported_on: new Date(),
          expected_result: "Smiley face",
          actual_result: "Sad Face",
          steps: "this is an updated step",
          developer: "Frodo",
          developer_notes: "working on it",
          last_updated: new Date()
        }

        const expectedBug = {
          ...testBugs[idToUpdate - 1],
          ...updateBug
        }

        return supertest(app)
          .patch(`/api/bugs/${idToUpdate}`)
          .send(updateBug)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/bugs/${idToUpdate}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(200)
              .expect(res => {
                expect(res.body.bug_name).to.eql(expectedBug.bug_name)
                expect(res.body.application_id).to.eql(expectedBug.application_id)
                expect(res.body.ticket_number).to.eql(expectedBug.ticket_number)
                expect(res.body.priority).to.eql(expectedBug.priority)
                expect(res.body.status).to.eql(expectedBug.status)
                expect(res.body.environment).to.eql(expectedBug.environment)
                expect(res.body.notes).to.eql(expectedBug.notes)
                expect(res.body.reported_by).to.eql(expectedBug.reported_by)
                const expectedReportedOn = new Date(expectedBug.reported_on).getMonth() + new Date(expectedBug.reported_on).getDay() + new Date(expectedBug.reported_on).getFullYear()
                const actualReportedOn = new Date(res.body.reported_on).getMonth() + new Date(res.body.reported_on).getDay() + new Date(res.body.reported_on).getFullYear()
                expect(actualReportedOn).to.eql(expectedReportedOn)
                expect(res.body.expected_result).to.eql(expectedBug.expected_result)
                expect(res.body.actual_result).to.eql(expectedBug.actual_result)
                expect(res.body.steps).to.eql(expectedBug.steps)
                expect(res.body.developer).to.eql(expectedBug.developer)
                expect(res.body.developer_notes).to.eql(expectedBug.developer_notes)
                const expectedLatestUpdate = new Date(expectedBug.latest_date).getMonth() + new Date(expectedBug.latest_date).getDay() + new Date(expectedBug.latest_date).getFullYear()
                const actualLatestUpdate = new Date(res.body.latest_date).getMonth() + new Date(res.body.latest_date).getDay() + new Date(res.body.latest_date).getFullYear()
                expect(actualLatestUpdate).to.eql(expectedLatestUpdate)
                expect(res.body).to.have.property('bug_id')
              })
          )
      })
    })
  });

  describe(`DELETE/api /bugs/:bug_id`, () => {
    context(`Given no bugs`, () => {
      it(`responds with 404`, () => {
        const bug_id = 123456
        return supertest(app)
          .delete(`/api/bugs/${bug_id}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `Bug Not Found` } })
      })
    });

    context('Given there are bugs in the database', () => {
      const testApplications = fixtures.makeApplicationsArray();
      const testBugs = fixtures.makeBugsArray()

      beforeEach('insert applications', () => {
        return db
          .into('applications')
          .insert(testApplications)
      })

      beforeEach('insert bugs', () => {
        return db
          .into('bugs')
          .insert(testBugs)
      })

      it('responds with 204 and removes the bug', () => {
        const idToRemove = 2
        const expectedBugs = testBugs.filter(bug => bug.bug_id !== idToRemove)

        return supertest(app)
          .delete(`/api/bugs/${idToRemove}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/bugs`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(res => {
                for (let i = 0; i < expectedBugs.length; i++) {
                  expect(res.body[i].bug_name).to.eql(expectedBugs[i].bug_name)
                  expect(res.body[i].application_id).to.eql(expectedBugs[i].application_id)
                  expect(res.body[i].ticket_number).to.eql(expectedBugs[i].ticket_number)
                  expect(res.body[i].priority).to.eql(expectedBugs[i].priority)
                  expect(res.body[i].status).to.eql(expectedBugs[i].status)
                  expect(res.body[i].environment).to.eql(expectedBugs[i].environment)
                  expect(res.body[i].notes).to.eql(expectedBugs[i].notes)
                  expect(res.body[i].reported_by).to.eql(expectedBugs[i].reported_by)
                  /////////expect(res.body[i].reported_on.substring(0, 9)).to.eql(expectedBugs[i].reported_on.substring(0, 9))
                  expect(res.body[i].expected_result).to.eql(expectedBugs[i].expected_result)
                  expect(res.body[i].actual_result).to.eql(expectedBugs[i].actual_result)
                  expect(res.body[i].steps).to.eql(expectedBugs[i].steps)
                  expect(res.body[i].developer).to.eql(expectedBugs[i].developer)
                  expect(res.body[i].developer_notes).to.eql(expectedBugs[i].developer_notes)
                  /////////expect(res.body[i].last_updated.substring(0, 9)).to.eql(expectedBugs[i].last_updated.substring(0, 9))
                  expect(res.body[i]).to.have.property('bug_id')
                }
              })
          )
      })
    });
  });
});