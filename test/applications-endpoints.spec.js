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
    db.raw('TRUNCATE users, bugs, applications RESTART IDENTITY CASCADE')
  });

  afterEach('cleanup', () => db.raw('TRUNCATE users, bugs, applications RESTART IDENTITY CASCADE'));

  after('disconnect from db', () => db.destroy())

  describe('GET /api/applications', () => {
    const testUsers = fixtures.makeUsersArray();

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })
    
    context(`Given no applications`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/applications')
          .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
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
          .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
          .expect(200, testApplications)
      })
    })
  })

  describe(`POST /api/applications`, () => {
    const testUsers = fixtures.makeUsersArray();

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })

    it(`creates an application, responding with 201 and the new application`, function () {
      this.retries(3);

      const newApplication = {
        application_name: 'add application name',
        application_url: 'http://www.newtest.com',
        repository_prod: 'update repository prod',
        repository_test: 'update repository test',
        database_prod: 'update database prod',
        database_test: 'update database test',
        user_id: 1,
      };

      return supertest(app)
        .post('/api/applications')
        .send(newApplication)
        .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect(res => {
          expect(res.body.user_id).to.eql(newApplication.user_id)
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
            .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
            .expect(res.body)
        )
    });
  });

  describe('GET /api/applications/:application_id', () => {
    const testUsers = fixtures.makeUsersArray();
    const testApplications = fixtures.makeApplicationsArray();

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })

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
        .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
        .expect(200, expectedApplication)
    })
  })

  describe(`PATCH /api/applications/:application_id`, () => {
    const testUsers = fixtures.makeUsersArray();
    const testApplications = fixtures.makeApplicationsArray();

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })

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
          .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
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
          .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/applications/${idToUpdate}`)
              .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
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
  
  describe(`DELETE/api /applications/:application_id`, () => {
    const testUsers = fixtures.makeUsersArray();

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })

    context(`Given no applications`, () => {
      it(`responds with 404`, () => {
        const application_id = 123456
        return supertest(app)
          .delete(`/api/applications/${application_id}`)
          .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Application Not Found` } })
      })
    });

    context('Given there are applications in the database', () => {
      const testApplications = fixtures.makeApplicationsArray();

    beforeEach('insert applications', () => {
      return db
        .into('applications')
        .insert(testApplications)
    })
    
      it('responds with 204 and removes the application', () => {
        const idToRemove = 2
        const expectedApplications = testApplications.filter(application => application.application_id !== idToRemove)

        return supertest(app)
          .delete(`/api/applications/${idToRemove}`)
          .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/applications`)
              .set('Authorization', fixtures.makeAuthHeader(testUsers[0]))
              .expect(res => {
                for (let i = 0; i < expectedApplications.length; i++) {
                  expect(res.body[i].application_name).to.eql(expectedApplications[i].application_name)
                  expect(res.body[i].application_url).to.eql(expectedApplications[i].application_url)
                  expect(res.body[i].repository_prod).to.eql(expectedApplications[i].repository_prod)
                  expect(res.body[i].repository_test).to.eql(expectedApplications[i].repository_test)
                  expect(res.body[i].database_prod).to.eql(expectedApplications[i].database_prod)
                  expect(res.body[i].database_test).to.eql(expectedApplications[i].database_test)
                  expect(res.body[i]).to.have.property('application_id')  
                }
            })
          )
      })
    });
  });
})