const db = require('../pool');

exports.insert_task = async (task) => {
  const {
    goal_id, name, start_date, due_date, finished, created_at, updated_at,
  } = task;

  try {
    const text = 'INSERT INTO tasks (goal_id, name, start_date, due_date, finished, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [
      goal_id, name, start_date, due_date, finished, created_at, updated_at,
    ];
    const result = await db.query(text, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error inserting Task:', err);
    throw err;
  }
};
