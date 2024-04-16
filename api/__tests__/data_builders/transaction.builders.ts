const date = require('date-and-time')
import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'
import database from '../../src/database'

const TABLE_NAME = 'transaction'

export { getRandomTransaction, salve, insertOne, insertMany, clearTable }

const getRandomTransaction = (data) => {
  let credit_card_data = {}

  if (data.method != 'pix' && data.method != 'credit_card') return "parameter 'method' required. Allowed options 'pix' or 'credit_card'";

  if (data.method == 'credit_card') {
    credit_card_data = {
      card_number: data.card_number ?? faker.finance.creditCardNumber().replace(/\-/g,''),
      card_valid: data.card_valid ?? date.format(new Date(faker.date.future({years: 2})), 'MMYY'),
      card_cvv: data.card_cvv ?? String(faker.number.int({min: 100, max: 999})),
    }
  }

  return {
    id: data.id ?? uuidv4(),
    amount: data.amount ?? parseInt(faker.finance.amount({min: 100, dec: 0})),
    description: data.description ?? faker.commerce.productDescription(),
    method: data.method,
    name: data.name ?? faker.person.fullName(),
    cpf: data.cpf ?? faker.finance.maskedNumber({ length: 11, parens: false, ellipsis: false }),
    'created_at':  date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    ...credit_card_data,
  };
}

const salve = async function (data): Promise<void> {
  data = [data].flat().map(transaction => Object.assign(transaction, { 'card_number': transaction['card_number'] ? transaction['card_number'].slice(transaction['card_number'].length - 4) : null}))
  await database(TABLE_NAME).insert(data)
}

const insertOne = async (method: string) => {
  return insertMany(method, 1)
}

const insertMany = async (method: string, count: number) => {
  const data = Array.from({ length: count })
    .map(() => getRandomTransaction({method}))
    .map(transaction => Object.assign(transaction, { 'card_number': transaction['card_number'] ? transaction['card_number'].slice(transaction['card_number'].length - 4) : null}))
  await database(TABLE_NAME).insert(data)
  return data;
}

const clearTable = async function (): Promise<void> {
  await database(TABLE_NAME).truncate()
}
