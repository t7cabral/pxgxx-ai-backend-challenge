const request = require('supertest')
import HttpStatus from 'http-status-codes'
import app from '../../src/app'
import * as TransactionBuilder from '../data_builders/transaction.builders'
import * as PaymentBuilder from '../data_builders/payment.builders'

const ROUTE_BASE = '/payment'

describe(`GET ${ROUTE_BASE}/summary`, () => {
    let payments

    beforeEach(async () => {
        await Promise.all([
          TransactionBuilder.clearTable(),
          PaymentBuilder.clearTable()
        ])
    })

    it('customer does not have a  \'paid \' value, it should come with a value of 0', async () => {
        payments = await Promise.all([
            PaymentBuilder.insertMany('credit_card', 3)
        ])
        payments = payments.flat()

        const { status, body } = await request(app).get(`${ROUTE_BASE}/summary`)

        const amount_waiting_funds = await payments
        .filter(p => p.status == 'waiting_funds')
        .reduce((acc, cur) => { return acc + cur.amount}, 0)

        expect(status).toBe(HttpStatus.OK)
        expect(body).toHaveProperty('paid', 0)
        expect(body).toHaveProperty('waiting_funds', amount_waiting_funds)
    })

    it('customer does not have a  \'waiting_funds \' value, it should come with a value of 0', async () => {
        payments = await Promise.all([
            PaymentBuilder.insertMany('pix', 2)
        ])
        payments = payments.flat()

        const { status, body } = await request(app).get(`${ROUTE_BASE}/summary`)

        const amount_paid = await payments
        .filter(p => p.status == 'paid')
        .reduce((acc, cur) => acc + cur.amount, 0)

        expect(status).toBe(HttpStatus.OK)
        expect(body).toHaveProperty('paid', amount_paid)
        expect(body).toHaveProperty('waiting_funds', 0)
    })

    it('get payment summary, must accept', async () => {
        payments = await Promise.all([
            PaymentBuilder.insertMany('pix', 2),
            PaymentBuilder.insertMany('credit_card', 3)
        ])
        payments = payments.flat()

        const { status, body } = await request(app).get(`${ROUTE_BASE}/summary`)

        const amount_paid = await payments
        .filter(p => p.status == 'paid')
        .reduce((acc, cur) => acc + cur.amount, 0)

        const amount_waiting_funds = await payments
        .filter(p => p.status == 'waiting_funds')
        .reduce((acc, cur) => { return acc + cur.amount}, 0)

        expect(status).toBe(HttpStatus.OK)
        expect(body).toHaveProperty('paid', amount_paid)
        expect(body).toHaveProperty('waiting_funds', amount_waiting_funds)
    })
})

