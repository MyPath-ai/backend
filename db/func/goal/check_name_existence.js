const db = require('../pool');

exports.check_name_existence = async (name, vision_id) => {
  try {
    const { rows } = await db.query('SELECT name FROM goals WHERE name = $1 AND vision_id = $2 ', [name, vision_id]);
    return rows.length > 0;
  } catch (err) {
    console.error('Error checking Vision Name: ', err);
    throw err;
  }
};
