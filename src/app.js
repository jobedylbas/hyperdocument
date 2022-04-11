const createError = require('http-errors')
const compression = require('compression')
const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const path = require('path')
const indexRouter = require(path.join(__dirname, 'routes', 'index'))

const config = require(path.join(__dirname, 'config.js'))

const port = config.web.port
const app = express()
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(compression())

// Setup view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/public', express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error', { breadcrumbs: []} )
})

app.listen(port, () => {
  console.log(`generation is live on Port: ${port}!`)
})

module.exports = app
