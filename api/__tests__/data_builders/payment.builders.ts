const date = require('date-and-time')
import database from '../../src/database'
import * as PaymentService from '../../src/services/paymentService'
import * as TransactionBuilder from './transaction.builders'

const TABLE_NAME = 'payment'

export { clearTable, calculatePayment, insertOne, insertMany }

const calculatePayment = async transactionData => {
  return PaymentService.generatePaymentDataBasedOnTransaction(transactionData)
}

const insertOne = async (method: string) => {
  return insertMany(method, 1)
}

const insertMany = async (method: string, count: number) => {
  const transaction_data = await TransactionBuilder.insertMany(method, count)
  const payment_data = await Promise.all(transaction_data.map(async transaction => await calculatePayment(transaction)))
  await database(TABLE_NAME).insert(payment_data)
  return payment_data
}

const clearTable = async () => {
  await database(TABLE_NAME).truncate()
}
