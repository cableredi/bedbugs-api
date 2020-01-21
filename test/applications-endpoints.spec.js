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

  describe(`POST /api/applications`, () => {
    it(`creates an application, responding with 201 and the new application`, function () {
      this.retries(3)
      const newApplication = {
        application_name: 'add application name',
        application_url: 'http://www.newtest.com',
        repository_prod: 'update repository prod',
        repository_test: 'update repository test',
        database_prod: 'update database prod',
        database_test: 'update database test',
      }
      return supertest(app)
        .post('/api/applications')
        .send(newApplication)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect(res => {
          expect(res.body.application_name).to.eql(newApplication.application_name)
          expect(res.body.application_url).to.eql(newApplication.application_url)
          expect(res.body.repository_prod).to.eql(newApplication.repository_prod)
          expect(res.body.repository_test).to.eql(newApplication.repository_test)
          expect(res.body.database_prod).to.eql(newApplication.database_prod)
          expect(res.body.database_test).to.eql(newApplication.database_test)
          expect(res.body).to.have.property('application_id')
          expect(res.headers.location).to.eql(`/api/applications/${res.body.application_id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/applications/${res.body.application_id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body)
        )
    });
  });

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

  describe(`PATCH /api/applications/:application_id`, () => {
    const testApplications = fixtures.makeApplicationsArray();

    beforeEach('insert applications', () => {
      return db
        .into('applications')
        .insert(testApplications)
    })

    context(`Given no applications`, () => {
      it(`responds with 404`, () => {
        const application_id = 123456
        return supertest(app)
          .patch(`/api/applications/${application_id}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `Application Not Found` } })
      })
    })

    context('Given there are applications in the database', () => {
      it('responds with 204 and updates the application', () => {
        const idToUpdate = 1
        const updateApplication = {
          application_name: 'updated application name',
          application_url: 'http://www.newtest.com',
          repository_prod: 'update repository prod',
          repository_test: 'update repository test',
          database_prod: 'update database prod',
          database_test: 'update database test',
        }

        const expectedApplication = {
          ...testApplications[idToUpdate - 1],
          ...updateApplication
        }

        return supertest(app)
          .patch(`/api/applications/${idToUpdate}`)
          .send(updateApplication)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/applications/${idToUpdate}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(200)
              .expect(res => {
                expect(res.body.application_name).to.eql(expectedApplication.application_name)
                expect(res.body.application_url).to.eql(expectedApplication.application_url)
                expect(res.body.repository_prod).to.eql(expectedApplication.repository_prod)
                expect(res.body.repository_test).to.eql(expectedApplication.repository_test)
                expect(res.body.database_prod).to.eql(expectedApplication.database_prod)
                expect(res.body.database_test).to.eql(expectedApplication.database_test)
                expect(res.body).to.have.property('application_id')
              })
          )
      })
    })
  });

  
})