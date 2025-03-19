require('dotenv').config()
const express = require('express')
const app = require('./app') // express real app
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')
const Blog = require('./models/blog')
const config = require('./utils/config')
const logger = require('./utils/logger')

// const password = process.argv[2]

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// const url =
//   `mongodb+srv://carloskalaykytedin:${password}@cluster0.mh1j9.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

// mongoose.set('strictQuery',false)
// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// const Person = mongoose.model('Person', personSchema)

// personSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.id
//     delete returnedObject.__v
//   }
// })

// let persons = [
//   { 
//     "id": 1,
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": 2,
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": 3,
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": 4,
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ]

app.use(cors())

morgan.token('type', function (request, response, next) {
  return JSON.stringify(request.body)
})

app.use(express.static('dist'))
app.use(morgan('tiny'))
app.use(morgan(':type'))
app.use(express.json())

// Create a new person
app.post('/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) { // === undefined
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  // if (persons.find(person => person.name === body.name)) {
  //   return response.status(400).json({ 
  //     error: 'name must be unique' 
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    console.log(savedPerson)
    response.json(savedPerson)
  })
  // persons = persons.concat(person)

  // response.json(person)
})

//Changing number of a person
app.put('/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
   .then(updatedPerson => {
      response.json(updatedPerson)
    })
   .catch(error => next(error))
})

// Delete a person
app.delete('/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})
// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter(person => person.id!== id)

//   response.status(204).end()
// })

// Get one person from its id
app.get('/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if(person){
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})
// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(person => person.id === id)
    
  
//     if (person) {
//       response.json(person)
//     } else {
//       response.status(404).end()
//     }
//   })

// Get for all persons
app.get('/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log(persons)
    response.json(persons)
  })
})

// BLOGS ->
app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

const time = new Date()

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${time}</p>`)
})

// const PORT = process.env.PORT
//Middleware for handling errors
app.use(errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})