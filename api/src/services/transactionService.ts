import { v4 as uuidv4 } from 'uuid'
const date = require('date-and-time')
import { pick } from 'lodash'
import database from '../database'
import * as PaymentService from './paymentService'

export { getOne, getAll, createOne };

const getOne = (id: string) => {
  return database
    .where({ id })
    .select()
    .from('transaction')
    .first();
}

const getAll = () => {
  return database
    .select()
    .table('transaction')
}

const generateTransactionData = async (data: any) => {
  data['id'] = uuidv4()
  data['created_at'] = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
  if (data['method'] == 'pix') {
    return pick(data, ['id', 'amount', 'description', 'method', 'name', 'cpf', 'created_at']);
  } else if (data['method'] == 'credit_card') {
    data['card_number'] = data['card_number'].slice(data['card_number'].length - 4)
    return data
  }
}

const createOne = async (data: any) => {
  try {
    // opening transaction in database
   return database.transaction(async trx => {
      // generating payment transaction data and inserting it into the database
      let transaction_data = await generateTransactionData(data);
      await trx('transaction').insert(transaction_data);

      // generating transaction payment data and inserting it into the database
      const payment_data = await PaymentService.generatePaymentDataBasedOnTransaction(transaction_data)
      await trx('payment').insert(payment_data)

      // returning transaction data
      return transaction_data;
    })
  } catch (error) {
    return error
  }
}
