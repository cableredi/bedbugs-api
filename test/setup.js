process.env.TZ = 'UTC'
process.env.CLIENT_ORIGIN = 'test'

require('dotenv').config()
const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest;