import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import api from './api'

dotenv.config({ silent: true })
const MySQLStore = require('express-mysql-session')(session)
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
app.set('port', port)

// Ability to read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Setup sessions and ability for cookie signing
if (process.env.NODE_ENV !== 'development') {
  app.set('trust proxy', 1) // trust first proxy
}
let sessOps = {
  secret: process.env.COOKIE_SECRET,
  name: 'JSSESSID',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    maxAge: null,
    path: '/'
  },
  store: sessionStore
}
app.use(session(sessOps))

// Helmet header protection
app.disable('x-powered-by')
app.use(helmet())

// Parse cookies from request (authorization)
app.use(cookieParser())

app.use(api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Express server listening on ' + host + ':' + port) // eslint-disable-line no-console
