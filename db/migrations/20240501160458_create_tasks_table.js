/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.integer('goal_id').unsigned().notNullable();
    table.string('name').notNullable();
    table.datetime('start_date');
    table.datetime('due_date');
    table.boolean('finished').defaultTo(false);
    table.timestamp('created_at');
    table.timestamp('updated_at');

    table.foreign('goal_id').references('id').inTable('goals').onDelete('CASCADE');
  }).then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `)).then(() => knex.raw(`
      CREATE TRIGGER update_tasks_updated_at
      BEFORE UPDATE ON tasks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `));
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw('DROP TRIGGER IF EXISTS update_visions_updated_at ON tasks')
    .then(() => knex.raw('DROP FUNCTION IF EXISTS update_updated_at_tasks'))
    .then(() => knex.schema.dropTable('tasks'));
};
