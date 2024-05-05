const db = require('../pool');

exports.check_name_existence = async (name, user_id) => {
  try {
    const { rows } = await db.query('SELECT name FROM visions WHERE name = $1 AND user_id = $2 ', [name, user_id]);
    return rows.length > 0;
  } catch (err) {
    console.error('Error checking Vision Name: ', err);
    throw err;
  }
};
