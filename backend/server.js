const express = require('express')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const path = require('path')
const cors = require('cors')
const colors = require('colors')
const port = process.env.PORT || 5000
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError')

connectDB()

const app = express()

// Body parser, reading data from body into req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Implement CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? ['http://localhost:3000']
        : ['https://vodhub.netlify.app'],
  })
)

app.options('*', cors())

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
})
app.use('/api', limiter)

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Routes
app.use('/api/todos', require('./routes/todoRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
