const db = require('../pool');

exports.put_vision = async (vision) => {
  const {
    id, user_id, name, start_date, due_date, finished, updated_at,
  } = vision;
  try {
    const text = 'UPDATE visions SET name = $2, start_date = $3, due_date = $4, finished = $5, updated_at = $6 WHERE id = $1 AND user_id = $7 RETURNING *';
    const values = [
      id,
      name,
      start_date,
      due_date,
      finished,
      updated_at,
      user_id,
    ];
    const results = await db.query(text, values);
    return results.rows[0];
  } catch (err) {
    console.error('Error updating Vision:', err);
    throw err;
  }
};
