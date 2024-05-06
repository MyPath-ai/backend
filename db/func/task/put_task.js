const db = require('../pool');

exports.put_task = async (task) => {
  const {
    id, goal_id, name, start_date, due_date, finished, updated_at,
  } = task;
  try {
    const text = 'UPDATE tasks SET name = $3, start_date = $4, due_date = $5, finished = $6, updated_at = $7 WHERE id = $1 AND goal_id = $2 RETURNING *';
    const values = [
      id, goal_id, name, start_date, due_date, finished, updated_at,
    ];
    const result = await db.query(text, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error updating Task:', err);
    throw err;
  }
};
