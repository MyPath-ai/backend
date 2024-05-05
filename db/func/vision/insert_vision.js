const db = require('../pool');

exports.insert_vision = async (vision) => {
  const {
    user_id, name, start_date, due_date, finished, created_at, updated_at,
  } = vision;

  try {
    const text = 'INSERT INTO visions (user_id, name, start_date, due_date, finished, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [
      user_id,
      name,
      start_date,
      due_date,
      finished,
      created_at,
      updated_at,
    ];
    const results = await db.query(text, values);
    return results.rows[0];
  } catch (err) {
    console.error('Error inserting Vision:', err);
    throw err;
  }
};
