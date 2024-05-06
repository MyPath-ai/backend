const db = require('../pool');

exports.select_goals = async (vision_id, finished = null, search = null) => {
  try {
    let query = 'SELECT * FROM goals WHERE vision_id = $1';
    const values = [vision_id];
    if (search && !finished) {
      query += ' AND name LIKE $2';
      values.push(`%${search}%`);
    }
    if (finished !== null && !search) {
      query += ' AND finished = $2';
      values.push(finished);
    }
    if (finished !== null && search) {
      query += ' AND finished = $2 AND name LIKE $3';
      values.push(finished, `%${search}%`);
    }
    const results = await db.query(query, values);
    return results.rows;
  } catch (err) {
    console.error('Error selecting Goals:', err);
    throw err;
  }
};
