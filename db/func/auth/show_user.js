const db = require('../pool');

exports.show_user = async (id) => {
  try {
    const { rows } = await db.query('SELECT name,nickname, email FROM users WHERE id = $1', [id]);
    return rows[0];
  } catch (err) {
    console.error('Error showing user:', err);
    throw err;
  }
};
