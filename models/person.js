const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

// console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: {
    type: String,
    minLength: 8,
    validate : {
      validator: function(value) {
        return /\d{2,3}-\d{8}/.test(value);
      },
      message: 'Not a valid phone number'
    }
  },
  id: Number,
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    //Cant delete or else the frontend wont be able to find the correct id and thats why it wouldnt work
    //Since i am learning, for now ill leave the console log with the ids but in the future
    //ill know they gotta be hidden
    delete returnedObject._id
    // delete returnedObject.id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)