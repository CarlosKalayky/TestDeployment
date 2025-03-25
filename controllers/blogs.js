const blogsRouter = require('express').Router()
const { config } = require('dotenv')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
    .find({})
    .populate('user', { username:1, name:1 })
  res.status(200).json(blogs)
    // Blog.find({}).then(blogs => {
    //     res.json(blogs)
    // })
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (err) {
    next(err)
  }
    // Blog.findById(request.params.id)
    //   .then(Blog => {
    //     if (Blog) {
    //       response.json(Blog)
    //     } else {
    //       response.status(404).end()
    //     }
    //   })
    //   .catch(error => next(error))
})
  
blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const token = getTokenFrom(request)
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!token) {
      return response.status(401).json({ error : 'token missing'})
    }

    try {
      const decodedToken = jwt.verify(token, config.SECRET)
      if(!decodedToken.id) {
        return response.status(401).json({ error : 'token invalid'})
      }

      const user = await User.findById(decodedToken.id)

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
      })

      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.status(201).json(savedBlog)
    } catch (error) {
      console.log("Error saving in the blogs")
      next(error)
    }
  
    // blog.save()
    //   .then(savedBlog => {
    //     response.json(savedBlog)
    //   })
    //   .catch(error => next(error))
})
  
blogsRouter.delete('/:id', async (request, response, next) => {
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)

    const user = await User.findById(request.user.id)
    if (!user) {
      return response.status(401).json({ error: 'user not found' });
    }
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(401).json({ error: 'blog not found' });
    }

    if (blog.user.toString() === user._id.toString()) {

    try{
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } catch(err){
      next(err)
    }
    // Blog.findByIdAndDelete(request.params.id)
    //   .then(() => {
    //     response.status(204).end()
    //   })
    //   .catch(error => next(error))
  }else{
    return response.status(403).json({ error: 'unauthorized : you are not the owner of this blog' })
  }
})
  
  blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
  
    //very important not to give the same name as the actual
    //object for example here Blog
    const updatedBlogData = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    }

    try {
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlogData, { new: true })
      if (updatedBlog) {
        response.json(updatedBlog)
      } else {
        response.status(404).json({error: 'Blog not found'})
      }
    } catch (err) {
      next(err)
    }
  
    // Blog.findByIdAndUpdate(request.params.id, Blog, { new: true })
    //   .then(updatedBlog => {
    //     response.json(updatedBlog)
    //   })
    //   .catch(error => next(error))
  })
  
  module.exports = blogsRouter