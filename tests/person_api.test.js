const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

// const Person = require('../models/person')

// beforeEach(async () => {
//   await Person.deleteMany({})

//   const personObjects = helper.initialPersons
//     .map(person => new Person(person))
//   const promiseArray = personObjects.map(person => person.save())
//   await Promise.all(promiseArray)
// })

test('persons are returned as json', async () => {
  await api
    .get('/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  // la ejecución llega aquí solo después de que se completa la solicitud HTTP
    // el resultado de la solicitud HTTP se guarda en la variable response
    // expect(response.body).toHaveLength(2)
    assert.strictEqual(response.body.length, 2)
    // assert.strictEqual(response.body.length, 2)
})

test('person without name is not added', async () => {
  const newPerson = {
    number: '123-4567890'
  }

  await api
   .post('/persons')
    .send(newPerson)
    .expect(400)

    const response = await api.get('/persons')
    assert.strictEqual(response.body.length, 12)
})

test('a specific person can be viewed', async () => {
  const personsAtStart = await helper.notesInDb()

  const personToView = personsAtStart[0]
  const resultPerson = await api
   .get(`/persons/${personToView.id}`)
   .expect(200)
   .expect('Content-Type', /application\/json/)

   assert.deepStrictEqual(resultPerson.body, personToView)
  })

test('a valid person can be added ', async () => {
  const newPerson = {
    name: 'async/await simplifies making async calls',
    number: '203-12345678'
  }

  await api
    .post('/persons')
    .send(newPerson)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/persons')

  const names = response.body.map(r => r.name)

  // assert.strictEqual(response.body.length, initialPersons.length + 1)

  assert(names.includes('async/await simplifies making async calls'))
})
  
test('the second blog is about our history', async () => {
    const response = await api.get('/blogs')
  
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