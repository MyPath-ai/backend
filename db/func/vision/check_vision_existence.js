const db = require('../pool');

exports.check_vision_existence = async (id, user_id) => {
  try {
    const { rows } = await db.query('SELECT id FROM visions WHERE id = $1 AND user_id = $2', [id, user_id]);
    return rows.length > 0;
  } catch (err) {
    console.error('Error checking Vision Existence:', err);
    throw err;
  }
};
