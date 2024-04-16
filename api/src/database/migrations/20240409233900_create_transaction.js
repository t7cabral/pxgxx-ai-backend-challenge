/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable('transaction', table => {
  table.string('id', 255).primary().comment('ID transaction');
  table.integer('amount').notNullable().comment('amount transaction');
  table.text('description').comment('description transaction');
  table.enu('method', ['pix', 'credit_card']).notNullable().comment('method transaction');
  table.string('name', 255).notNullable().comment('name payer');
  table.string('cpf', 11).notNullable().comment('CPF payer');
  table.string('card_number', 4).comment('last four card number');
  table.string('card_valid', 4).comment('card validity in MMAA format');
  table.string('card_cvv', 3).comment('card cvv');
  table.timestamp('created_at').notNullable().comment('registration date');
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable('transaction')
