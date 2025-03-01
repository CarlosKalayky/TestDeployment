const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', async (req, res) => {
  const persons = await Person.find({})
  res.json(persons)
})

personsRouter.get('/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })
  
  personsRouter.post('/', (request, response, next) => {
    const body = request.body
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => {
        console.log("Error saving in the persons")
        next(error)
      })
  })
  
  personsRouter.delete('/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  
  personsRouter.put('/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  
  module.exports = personsRouter