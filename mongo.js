const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const nameInput = process.argv[3]
const numberInput = process.argv[4]

const url =
  `mongodb+srv://carloskalaykytedin:${password}@cluster0.mh1j9.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: `${nameInput}`,
    number: `${numberInput}`,
  })

if (process.argv.length>3) {
    person.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
  }

  if (process.argv.length=2) {
    Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
  }