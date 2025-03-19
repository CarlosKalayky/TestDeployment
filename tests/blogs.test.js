const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('blogs tests',  () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash: await bcrypt.hash('testpassword', 10)
    })
    await user.save()

    const userForToken = {
      username: user.username,
      id: user.id
    }
    token = jwt.sign(userForToken, process.env.SECRET)

    const blogsWithUser = helper.initialBlogs.map(blog => ({
      ...blog,
      user: user._id, // Associate each blog with the user
    }))
    await Blog.insertMany(blogsWithUser)
    // console.log(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs have id instead of _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach(blog => {
      assert.ok(blog.id) //verifica que `id` esté definido
      assert.strictEqual(blog._id, undefined) //verifica que `_id` no esté definido
    })
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'testBlog',
      author: 'zzcc',
      url: 'http://example.com/new-blog',
      likes: 4
    }

    await api
     .post('/api/blogs')
     .set('Authorization', `Bearer ${token}`)
     .send(newBlog)
     .expect(201)
     .expect('Content-Type', /application\/json/)

     const response = await api.get('/api/blogs')
     const blogs = response.body
    //  console.log(blogs)
    //  console.log(helper.initialBlogs)

     assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
  })

  // after(async () => {
  //   await mongoose.connection.close()
  // })

  test('a blog doesnt have likes defined', async () => {
    const newBlog = {
      title: 'testBlog224',
      author: 'zzcc',
      url: 'http://example.com/new-blog222224444'
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)


   const response = await api.get('/api/blogs')
   const blogs = response.body

   //a way to do this is either by looking at the last blog added blogs.length-1
   //or by using lodash's findLast method but since it wasnt asking for it no problem
   assert.strictEqual(blogs[blogs.length - 1].likes, 0)
  })

  test('a blog without title or url is not added', async () => {
    const newBlog = {
      author: 'zzcc',
      url: 'http://example.com/new-blog',
      likes: 4
    }

    await api
     .post('/api/blogs')
     .set('Authorization', `Bearer ${token}`)
     .send(newBlog)
     .expect(400)
  
     const response = await api.get('/api/blogs')
     const blogs = response.body

     assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })

  test('adding a blog fails with status code 401 if no token is provided', async () => {
    const newBlog = {
      title: 'testBlog',
      author: 'zzcc',
      url: 'http://example.com/new-blog',
      likes: 4
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

})

describe('removing blog', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash: await bcrypt.hash('testpassword', 10)
    })
    await user.save();

    const userForToken = {
      username: user.username,
      id: user._id
    }
    token = jwt.sign(userForToken, process.env.SECRET)

    await Blog.insertMany(helper.initialBlogs)
    // console.log(helper.initialBlogs)
  })

  test('a blog that does not exist is not removed', async () => {
    const nonExistentBlogId = '98476954694936763847653823723'
    await api
      .delete(`/api/blogs/${nonExistentBlogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
    const blogsAfterDeletion = await Blog.find({})
    // console.log(blogsAfterDeletion)
    // console.log(helper.initialBlogs)
    //doesnt as to expect a 400 response so we dont have to add it
    assert.strictEqual(blogsAfterDeletion.length, helper.initialBlogs.length)
  })

  test('a valid blog can be removed', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
    const blogsAfterDeletion = await Blog.find({})
    assert.strictEqual(blogsAfterDeletion.length, helper.initialBlogs.length - 1)
    // console.log(blogsAfterDeletion)
    // console.log(blogsAtStart)
  })

  test('deleting a blog fails with status code 401 if no token is provided', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAfterDeletion = await Blog.find({})
    assert.strictEqual(blogsAfterDeletion.length, helper.initialBlogs.length)
  })
})

// beforeEach(async () => {
//   await Blog.deleteMany({})

//   await Blog.insertMany(helper.initialBlogs)
//   // console.log(helper.initialBlogs)
// })

// describe('updating blog', () => {
//   test('a blog can be updated', async () => {
//     const blogsAtStart = await Blog.find({})
//     const blogToUpdate = blogsAtStart[1]
//     // console.log(blogToUpdate)
//     const updatedBlog = {
//       title: "Clean Code",
//       author: "Robert C. Martin",
//       url: "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882",
//       likes: 100,
//       id: "67c9a039c649786b6e835108"
//     }

//     assert.notStrictEqual(blogToUpdate.likes, updatedBlog.likes);
//     // console.log(blogToUpdate.likes, updatedBlog.likes)
//     // console.log(blogToUpdate.id)

//     await api.put(`/api/blogs/${blogToUpdate.id}`)
//      .send(updatedBlog)
//      .expect(200)

//      const updatedBlogInDb = await Blog.findById(blogToUpdate.id)
//     //  console.log(updatedBlogInDb)
//      assert.deepStrictEqual(updatedBlogInDb.likes, 100)
//      // console.log(updatedBlogInDb)
//      // console.log(blogToUpdate)
//   })
// })

