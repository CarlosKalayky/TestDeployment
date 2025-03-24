const personsRouter = require('express').Router()
const Person = require('../models/person')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const getTokenFrom = request => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    console.log('authorization extracted')
    return authorization.replace('Bearer ', '')
  }
  return null
}

personsRouter.get('/', async (req, res) => {
  const persons = await Person.find({})
  res.json(persons)
})

personsRouter.get('/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  } catch (err) {
    next(err)
  }
    // Person.findById(request.params.id)
    //   .then(person => {
    //     if (person) {
    //       response.json(person)
    //     } else {
    //       response.status(404).end()
    //     }
    //   })
    //   .catch(error => next(error))
  })
  
personsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const token = getTokenFrom(request)
    console.log('token', token)
    if(!token) {
      return response.status(401).json({ error : 'token missing'})
    }

    try {
      const decodedToken = jwt.verify(token, config.SECRET)
      if(!decodedToken.id) {
        return response.status(401).json({ error : 'token invalid'})
      }

      const user = await User.findById(decodedToken.id)
  
      const person = new Person({
        name: body.name,
        number: body.number,
        user: user.id
      })
    
      const savedPerson = await person.save()
      user.persons = user.persons.concat(savedPerson._id)
      await user.save()
      response.status(201).json(savedPerson)
      } catch (error) {
          console.log("Error saving in the persons")
          next(error)
      }
    // person.save()
    //   .then(savedPerson => {
    //     response.status(201).json(savedPerson)
    //   })
    //   .catch(error => {
    //     console.log("Error saving in the persons")
    //     next(error)
    //   })
})
  
personsRouter.delete('/:id', async (request, response, next) => {
    try{
      await Person.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } catch (err) {
      next(err)
    }
    // Person.findByIdAndDelete(request.params.id)
    //   .then(() => {
    //     response.status(204).end()
    //   })
    //   .catch(error => next(error))
})
  
personsRouter.put('/:id', (request, response, next) => {
    const body = request.body
  
    //very important not to give the same name as the actual
    //object for example here Person
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