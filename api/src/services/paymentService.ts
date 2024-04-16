// @ts-nocheck
import { v4 as uuidv4 } from 'uuid'
const date = require('date-and-time')
import database from '../database'

const transactionFee = {
    'pix': {
        fee: 0.0299,
        deadlinePayDays: 0
    },
    'credit_card': {
        fee: 0.089,
        deadlinePayDays: 15
    }
}

export { generatePaymentDataBasedOnTransaction, getSummary };

const generatePaymentDataBasedOnTransaction = async transactionData => {
    return {
        'id': uuidv4(),
        'transaction_id': transactionData.id,
        'amount': transactionData.amount - (transactionData.amount * transactionFee[transactionData.method].fee).toFixed(0),
        'status': transactionData.method === 'pix' ? 'paid' : 'waiting_funds',
        'payment_date': date.format(date.addDays(date.parse(transactionData.created_at, 'YYYY-MM-DD HH:mm:ss'), transactionFee[transactionData.method].deadlinePayDays), 'YYYY-MM-DD HH:mm:ss'),
    }
}

const getSummary = async () => {
    const data = await database('payment').select('status').sum({ amount: 'amount' }).groupBy('status')
    return data.reduce((acumulador, item, _index, _array) => {
        acumulador[item.status] = item.amount
        return acumulador
    }, {})
}
