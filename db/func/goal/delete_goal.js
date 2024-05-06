const db = require('../pool');

exports.delete_goal = async (id, vision_id) => {
  try {
    const text = 'DELETE FROM goals WHERE id = $1 AND vision_id = $2';
    const values = [id, vision_id];
    await db.query(text, values);
  } catch (err) {
    console.error('Error deleting Goal:', err);
    throw err;
  }
};
