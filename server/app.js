require('dotenv').config()

const express = require('express');
const cors = require('cors')
const router = require('./routes')
const app = express()
const errorHandler = require('./middlewares/errorHandler')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded(true))
app.use(router)

app.use(errorHandler)


module.exports = app
