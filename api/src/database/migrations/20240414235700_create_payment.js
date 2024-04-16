/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable('payment', table => {
  table.string('id', 255).primary().comment('ID payment');
  table.enu('status', ['paid', 'waiting_funds']).notNullable().comment('status payment');
  table.timestamp('payment_date').notNullable().comment('date payment');
  table.integer('amount').notNullable().comment('amount with fee debited');
  table.string('transaction_id', 255);
  table.dropForeign("transaction_id");
  table
      .foreign('transaction_id')
      .references('transaction.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  //table.foreign('transaction_id').references('transaction.id').onDelete("CASCADE").onUpdate("CASCADE").withKeyName('fk_transaction');
})

/*
exports.down = knex => knex.schema.alterTable('payment', table => {
    table.dropForeign("transaction_id");
    table.foreign('transaction_id').references('transaction.id').onDelete('NO ACTION').onUpdate('NO ACTION');
})*/

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable('payment')
