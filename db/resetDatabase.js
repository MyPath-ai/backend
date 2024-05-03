// resetDatabase.js
const knex = require('knex')(require('../knexfile').development);

knex.raw(`
  DO $$ DECLARE
    r RECORD;
  BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
      EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
  END $$;
`)
  .then(() => console.log('Database reset.'))
  .catch((error) => console.error('Database reset failed:', error))
  .finally(() => knex.destroy());
