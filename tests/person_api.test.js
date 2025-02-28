const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test.only('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  // la ejecución llega aquí solo después de que se completa la solicitud HTTP
    // el resultado de la solicitud HTTP se guarda en la variable response
    // expect(response.body).toHaveLength(2)
    assert.strictEqual(response.body.length, 2)
    // assert.strictEqual(response.body.length, 2)
})
  
test('the second blog is about our history', async () => {
    const response = await api.get('/api/blogs')
  
    const titles = response.body.map(e => e.title)
    assert.strictEqual(titles.includes('our history'), true)
})

after(async () => {
  await mongoose.connection.close()
})

//this would remove the data from the start and then save the new data which we could implemente at the start
// beforeEach(async () => {
//     await Note.deleteMany({})
//     let noteObject = new Note(initialNotes[0])
//     await noteObject.save()
//     noteObject = new Note(initialNotes[1])
//     await noteObject.save()
// })