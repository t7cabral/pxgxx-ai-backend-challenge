import bodyParser = require('body-parser')
import express = require('express')
import cors = require('cors')
import path from 'path'

import transactionRouters from './routes/transaction'
import paymentRouters from './routes/payment'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/transaction', transactionRouters)
app.use('/payment', paymentRouters)

// Home page
app.get('/', (_request, response) => {
  response.sendFile(path.join(__dirname + '/pages/home.html'))
})

export default app
