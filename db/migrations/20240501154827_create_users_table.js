/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('nickname');
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamp('created_at');
    table.timestamp('updated_at');
  }).then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `)).then(() => knex.raw(`
      CREATE TRIGGER update_visions_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw('DROP TRIGGER IF EXISTS update_users_updated_at ON users')
    .then(() => knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column'))
    .then(() => knex.schema.dropTable('users'));
};
