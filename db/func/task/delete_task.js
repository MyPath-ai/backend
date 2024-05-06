const db = require('../pool');

exports.delete_task = async (id, goal_id) => {
  try {
    const text = 'DELETE FROM tasks WHERE id = $1 AND goal_id = $2 RETURNING *';
    const values = [id, goal_id];
    const result = await db.query(text, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error deleting Task:', err);
    throw err;
  }
};
