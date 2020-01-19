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
    db.raw('TRUNCATE steps, bugs, applications RESTART IDENTITY CASCADE')
  });

  afterEach('cleanup', () => db.raw('TRUNCATE steps, bugs, applications RESTART IDENTITY CASCADE'));

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
      const testSteps = fixtures.makeStepsArray()

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

      beforeEach('insert steps', () => {
        return db
          .into('steps')
          .insert(testSteps)
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
              expect(res.body[i].reported_on.substring(0,9)).to.eql(testBugs[i].reported_on.substring(0,9))
              expect(res.body[i].expected_result).to.eql(testBugs[i].expected_result)
              expect(res.body[i].actual_result).to.eql(testBugs[i].actual_result)
              expect(res.body[i].developer).to.eql(testBugs[i].developer)
              expect(res.body[i].developer_notes).to.eql(testBugs[i].developer_notes)
              expect(res.body[i].last_updated.substring(0,9)).to.eql(testBugs[i].last_updated.substring(0,9))
              expect(res.body[i]).to.have.property('bug_id')
            }
        })
      })
    })
  })
})