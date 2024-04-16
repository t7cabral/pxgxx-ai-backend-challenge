const request = require('supertest')
import HttpStatus from 'http-status-codes'
import * as date from 'date-and-time'
import app from '../../src/app'

import * as TransactionBuilder from '../data_builders/transaction.builders'
import * as PaymentBuilder from '../data_builders/payment.builders'
import database from '../../src/database'


const ROUTE_BASE = '/transaction'

beforeAll(async () => {
  await Promise.all([
    TransactionBuilder.clearTable(),
    PaymentBuilder.clearTable()
  ])
})

describe(`GET ${ROUTE_BASE}`, () => {
  const known_transsaction = TransactionBuilder.getRandomTransaction({id: 'aaa-aaa', 'method': 'pix'})

  beforeAll(async () => {
    await Promise.all([
      TransactionBuilder.salve(known_transsaction),
      TransactionBuilder.insertMany('pix', 2),
      TransactionBuilder.insertMany('credit_card', 2)
    ])
  })

  it('get transaction by valid \'id\', must accept', async () => {
    const response = await request(app).get(`${ROUTE_BASE}/${known_transsaction['id']}`)
    const { status, body } = response
    expect(status).toBe(HttpStatus.OK)
    expect(body.id).toEqual(known_transsaction['id'])
  })

  it('get transaction by invalid \'id\', must return empty object', async () => {
    const response = await request(app).get(`${ROUTE_BASE}/xxx-xxx}`)
    const { status, body } = response
    expect(status).toBe(HttpStatus.OK)
    expect(body).toEqual({})
  })

  it('list all transactions, must accept', async () => {
    const response = await request(app).get(ROUTE_BASE)
    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toHaveLength(5)
  })
})

describe(`POST ${ROUTE_BASE}`, () => {
  it('incorrect \'description\' field, must reject', async () => {
    const data = await TransactionBuilder.getRandomTransaction({method: 'credit_card'})
    data['description'] = 123

    const response = await request(app)
      .post(ROUTE_BASE)
      .send(data)

    const { status, body } = response
    expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(body).toHaveProperty('errorCode', 'ERR_500_TRANSACTION_INVALID_FIELDS')
    expect(body).toHaveProperty('message', '"description" must be a string')
  })

  it('incorrect \'method\' field, must reject', async () => {
    const data = await TransactionBuilder.getRandomTransaction({method: 'credit_card'})
    data['method'] = 'aaa'

    const response = await request(app)
      .post(ROUTE_BASE)
      .send(data)
      
    const { status, body } = response
    expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(body).toHaveProperty('errorCode', 'ERR_500_TRANSACTION_INVALID_FIELDS')
    expect(body).toHaveProperty('message', '"method" must be one of [pix, credit_card]')
  })

  it('incorrect \'name\' field, must reject', async () => {
    const data = await TransactionBuilder.getRandomTransaction({method: 'credit_card'})
    data['name'] = ''

    const response = await request(app)
      .post(ROUTE_BASE)
      .send(data)
      
    const { status, body } = response
    expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(body).toHaveProperty('errorCode', 'ERR_500_TRANSACTION_INVALID_FIELDS')
    expect(body).toHaveProperty('message', '"name" is not allowed to be empty')
  })

  it('incorrect \'cpf\' field, must reject', async () => {
    const data = await TransactionBuilder.getRandomTransaction({method: 'credit_card'})
    data['cpf'] = '0010020039x'

    const response = await request(app)
      .post(ROUTE_BASE)
      .send(data)
      
    const { status, body } = response
    expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(body).toHaveProperty('errorCode', 'ERR_500_TRANSACTION_INVALID_FIELDS')
    expect(body).toHaveProperty('message','"cpf" with value "0010020039x" fails to match the required pattern: /^\\d{11}$/')
  })

  it('valid data and with malicious javascript code, you must remove the javascript code and validly accept', async () => {
    const data = await TransactionBuilder.getRandomTransaction({method: 'credit_card'})

    // injecting malicious instruction
    data['description'] = 'Description without <script>javascript:alert(1)</script>XSS attack'

    const response = await request(app)
      .post(ROUTE_BASE)
      .send(data)
    const { status, body:transaction_data } = response
    expect(status).toBe(HttpStatus.CREATED)

    // checking transaction data
    expect(transaction_data).toHaveProperty('amount', data['amount'])
    expect(transaction_data).toHaveProperty('description', 'Description without XSS attack')
    expect(transaction_data).toHaveProperty('method', data['method'])
    expect(transaction_data).toHaveProperty('name', data['name'])
    expect(transaction_data).toHaveProperty('cpf', data['cpf'])
    expect(transaction_data).toHaveProperty('card_number', data['card_number'].slice(data['card_number'].length - 4))
    expect(transaction_data).toHaveProperty('card_valid', data['card_valid'])
    expect(transaction_data).toHaveProperty('card_cvv', data['card_cvv'])
    expect(transaction_data).toHaveProperty('created_at')

    // checking payment data
    const payment_expected = await PaymentBuilder.calculatePayment(transaction_data)
    const payment_db = await database.where({ transaction_id: transaction_data.id  }).select().from('payment').first()
    expect(payment_db).toHaveProperty('id')
    expect(payment_db).toHaveProperty('transaction_id', payment_expected.transaction_id)
    expect(payment_db).toHaveProperty('status', payment_expected.status)
    expect(payment_db).toHaveProperty('payment_date')
    expect(date.format(payment_db.payment_date, 'YYYY-MM-DD HH:mm:ss')).toEqual(payment_expected.payment_date)
    expect(payment_db).toHaveProperty('amount', payment_expected.amount)
  })

  it('valid \'credit_card\' transaction, must accept', async () => {
    const data = await TransactionBuilder.getRandomTransaction({method: 'credit_card'})
    const response = await request(app)
      .post(ROUTE_BASE)
      .send(data)
    const { status, body:transaction_data } = response
    expect(status).toBe(HttpStatus.CREATED)

    // checking transaction data
    expect(transaction_data).toHaveProperty('amount', data['amount'])
    expect(transaction_data).toHaveProperty('description', data['description'])
    expect(transaction_data).toHaveProperty('method', data['method'])
    expect(transaction_data).toHaveProperty('name', data['name'])
    expect(transaction_data).toHaveProperty('cpf', data['cpf'])
    expect(transaction_data).toHaveProperty('card_number', data['card_number'].slice(data['card_number'].length - 4))
    expect(transaction_data).toHaveProperty('card_valid', data['card_valid'])
    expect(transaction_data).toHaveProperty('card_cvv', data['card_cvv'])
    expect(transaction_data).toHaveProperty('created_at')

    // checking payment data
    const payment_expected = await PaymentBuilder.calculatePayment(transaction_data)
    const payment_db = await database.where({ transaction_id: transaction_data.id  }).select().from('payment').first()
    expect(payment_db).toHaveProperty('id')
    expect(payment_db).toHaveProperty('transaction_id', payment_expected.transaction_id)
    expect(payment_db).toHaveProperty('status', payment_expected.status)
    expect(payment_db).toHaveProperty('payment_date')
    expect(date.format(payment_db.payment_date, 'YYYY-MM-DD HH:mm:ss')).toEqual(payment_expected.payment_date)
    expect(payment_db).toHaveProperty('amount', payment_expected.amount)
  })

  it('valid \'pix\' transaction, must accept', async () => {
    const data = await TransactionBuilder.getRandomTransaction({method: 'pix'})
    const response = await request(app)
      .post(ROUTE_BASE)
      .send(data)

    const { status, body:transaction_data } = response
    expect(status).toBe(HttpStatus.CREATED)
  
    // checking transaction data
    expect(status).toBe(HttpStatus.CREATED)
    expect(transaction_data).toHaveProperty('amount', data['amount'])
    expect(transaction_data).toHaveProperty('description', data['description'])
    expect(transaction_data).toHaveProperty('method', data['method'])
    expect(transaction_data).toHaveProperty('name', data['name'])
    expect(transaction_data).toHaveProperty('cpf', data['cpf'])
    expect(transaction_data).toHaveProperty('created_at')

    // checking payment data
    const payment_expected = await PaymentBuilder.calculatePayment(transaction_data)
    const payment_db = await database.where({ transaction_id: transaction_data.id  }).select().from('payment').first()
    expect(payment_db).toHaveProperty('id')
    expect(payment_db).toHaveProperty('transaction_id', payment_expected.transaction_id)
    expect(payment_db).toHaveProperty('status', payment_expected.status)
    expect(payment_db).toHaveProperty('payment_date')
    expect(date.format(payment_db.payment_date, 'YYYY-MM-DD HH:mm:ss')).toEqual(payment_expected.payment_date)
    expect(payment_db).toHaveProperty('amount', payment_expected.amount)
  })
})
