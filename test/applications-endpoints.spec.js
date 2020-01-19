const knex = require('knex');
const fixtures = require('./bedbugs-fixtures');
const app = require('../src/app');

describe('Applications Endpoints', () => {
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

  describe('GET /api/applications', () => {
    context(`Given no applications`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/applications')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('Given there are applications in the database', () => {
      const testApplications = fixtures.makeApplicationsArray()

      beforeEach('insert applications', () => {
        return db
          .into('applications')
          .insert(testApplications)
      })

      it('gets the applications from database', () => {
        return supertest(app)
          .get('/api/applications')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testApplications)
      })
    })
  })

  describe('GET /api/applications/:application_id', () => {
    const testApplications = fixtures.makeApplicationsArray();

    beforeEach('insert applications', () => {
      return db
        .into('applications')
        .insert(testApplications)
    })

    it('responds with 200 and the specified application', () => {
      const application_id = 2;
      const expectedApplication = fixtures.makeExpectedApplication();

      return supertest(app)
        .get(`/api/applications/${application_id}`)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, expectedApplication)
    })
  })
})