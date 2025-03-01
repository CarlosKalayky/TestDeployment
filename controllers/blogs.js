const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res) => {
    Blog.find({}).then(blogs => {
        res.json(blogs)
    })
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
      .then(Blog => {
        if (Blog) {
          response.json(Blog)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })
  
  blogsRouter.post('/', (request, response, next) => {
    const body = request.body
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    })
  
    blog.save()
      .then(savedBlog => {
        response.json(savedBlog)
      })
      .catch(error => next(error))
  })
  
  blogsRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndDelete(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  
  blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body
  
    const Blog = {
      name: body.name,
      number: body.number
    }
  
    Blog.findByIdAndUpdate(request.params.id, Blog, { new: true })
      .then(updatedBlog => {
        response.json(updatedBlog)
      })
      .catch(error => next(error))
  })
  
  module.exports = blogsRouter