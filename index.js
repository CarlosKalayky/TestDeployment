require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

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


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(cors())

morgan.token('type', function (request, response, next) {
  return JSON.stringify(request.body)
})

app.use(express.static('dist'))
app.use(morgan('tiny'))
app.use(morgan(':type'))
app.use(express.json())


const generateId = () => {
  const maxId = persons.length > 0
    ? Math.floor(Math.random() * persons.length)
    : 0
  return maxId + 1
}

// Create a new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  // persons = persons.concat(person)

  // response.json(person)
})

// Delete a person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id!== id)

  response.status(204).end()
})

// Get one person from its id
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
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
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

const time = new Date()

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${time}</p>`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})