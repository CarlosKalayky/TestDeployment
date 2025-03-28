const logger = require('./logger')
const config = require('../utils/config')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')

  if (authorization) {
    request.token = authorization.replace('Bearer ', '')
    console.log(request.token)
  } else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.SECRET)
      request.user = decodedToken.id
      next()
    }catch (err) {
      request.user = null
      next()
    }
  } else {
    request.user = null
    next()
  }
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

module.exports = {
  requestLogger,                                                                                
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}