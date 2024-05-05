const db = require('../pool');

exports.delete_vision = async (id, user_id) => {
  try {
    const text = 'DELETE FROM visions WHERE id = $1 AND user_id = $2';
    const values = [id, user_id];
    await db.query(text, values);
  } catch (err) {
    console.error('Error deleting Vision:', err);
    throw err;
  }
};
