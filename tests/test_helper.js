const Person = require('../models/person')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialPersons = [
    {
        name: "Zuzannaa",
        number: "040-12345646",
        id: "67b32b12d2328fcb76af37bc"
      },
      {
        name: "ZuzanniTA KK",
        number: "695985",
        id: "67b5e80eff94842f343bcb6a"
      },
      {
        name: "porfin",
        number: "3223",
        id: "67b5efec613260134186a7db"
      },
      {
        name: "this works i guess",
        number: "7227566",
        id: "67b7431a7d9c2acec6d7fc7e"
      },
      {
        name: "i miss us",
        number: "224",
        id: "67b74e1d7d9c2acec6d7fc91"
      },
      {
        name: "sadasdads",
        number: "321424",
        id: "67b889d5a7ccf73cbbff4e72"
      },
      {
        name: "sadasdads",
        number: "321424",
        id: "67b889d5a7ccf73cbbff4e74"
      },
      {
        name: "sadasdads",
        number: "321424",
        id: "67b889d5a7ccf73cbbff4e76"
      },
      {
        name: "carlosstest",
        number: "020-28374837",
        id: "67bcb14898d027bdf117664d"
      },
      {
        name: "meow",
        number: "432-43234211",
        id: "67c1ecb1bc341fa42a9b7286"
      },
      {
        name: "And the most hot",
        number: "69-69692240",
        id: "67c1ee7bbc341fa42a9b728a"
      },
      {
        name: "async/await simplifies making async calls",
        number: "203-12345678",
        id: "67c72f456b20d92e13af98cf"
      }
]

const initialBlogs = [
  {
    title: "React patterns",
    author: "Dan Abramov",
    url: "https://reactpatterns.com/",
    likes: 7,
    id: "67c1ee7bbc341fa42a9b7289"
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    url: "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882",
    likes: 5,
    id: "67c1ee7bbc341fa42a9b728b"
  },
  {
    title: "TDD harms architecture",
    author: "Kent Beck",
    url: "http://www.xprogramming.com/book/tdd/",
    likes: 12,
    id: "67c1ee7bbc341fa42a9b728c"
  },
  {
    title: "ZuzanniTA KK",
    author: "695985",
    url: "https://www.google.es/books/edition/Meridiano_de_sangre/wZkVijLJVV4C?hl=es&gbpv=1&printsec=frontcover",
    likes: 20,
    id: "67bc64d688bd25d34d41e62a"
  },
  {
    title: "our history",
    author: "cz",
    url: "https://i.pinimg.com/550x/c1/be/9f/c1be9f3a337e2cabc639dddc6f4b71e7.jpg",
    likes: 224,
    id: "67bc6baf88bd25d34d41e62d"
  },
  {
    title: "random 1",
    author: "Kent Beck",
    url: "http://qwww.xprogreramming.com/book/tdd/",
    likes: 12,
    id: "67c1ee7bbc344fa49a9b728c"
  },
  {
    title: "random 2",
    author: "695985",
    url: "https://www.google.es/asda/edition/fdsfMeridiano_dwere_sangre/wZkVijLJVV4C?hl=erwes&gbpv=1&printsec=frontcover",
    likes: 50,
    id: "67bc64d668bd25d34d81e62a"
  }
]

const initialUsers = [
  {
    _id: "67b32b12d2328fcb76af37bc",
    username: "testuser",
    name: "Test User",
    passwordHash: 123
  },
  {
    _id: "67bcb14898d027bdf117664d",
    username: "carlos",
    name: "Carlos Stest",
    passwordHash: 123
  },
  {
    _id: "67c1ee7bbc341fa42a9b7289",
    username: "admin",
    name: "Admin User",
    passwordHash: 123
  }
]


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
    const person = new Person({ name: 'willremovethissoon', number:'224-12345678' })
    await person.save()
    await person.deleteOne()
  
    return person._id.toString()
}

const personsInDb = async () => {
    const persons = await Person.find({})
    return persons.map(person => person.toJSON())
}
  
module.exports = {
    initialBlogs, initialPersons, nonExistingId, personsInDb, blogsInDb, initialUsers, usersInDb
}