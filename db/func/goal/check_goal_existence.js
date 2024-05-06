const db = require('../pool');

exports.check_goal_existence = async (id, vision_id) => {
  try {
    const { rows } = await db.query('SELECT id FROM goals WHERE id = $1 AND vision_id = $2', [id, vision_id]);
    return rows.length > 0;
  } catch (err) {
    console.error('Error checking Goal Existence:', err);
    throw err;
  }
};
