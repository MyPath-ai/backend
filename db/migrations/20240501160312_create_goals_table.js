/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('goals', table => {
    table.increments('id').primary();
    table.integer('vision_id').unsigned().notNullable();
    table.string('name').notNullable();
    table.string('prompt');
    table.datetime('start_date');
    table.datetime('due_date');
    table.boolean('finished').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('vision_id').references('id').inTable('visions').onDelete('CASCADE');
  }).then(() => {
    return knex.raw(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
  }).then(() => {
    return knex.raw(`
      CREATE TRIGGER update_goals_updated_at
      BEFORE UPDATE ON goals
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw('DROP TRIGGER IF EXISTS update_goals_updated_at ON goals')
    .then(() => knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column'))
    .then(() => knex.schema.dropTable('goals'));
};

