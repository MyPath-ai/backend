const db = require('../pool');

exports.check_task_existence = async (id, goal_id) => {
  try {
    const { rows } = await db.query('SELECT id FROM tasks WHERE id = $1 AND goal_id = $2', [id, goal_id]);
    return rows.length > 0;
  } catch (err) {
    console.error('Error checking Task Existence:', err);
    throw err;
  }
};
