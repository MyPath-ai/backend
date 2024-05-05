const db = require('../pool');

exports.select_visions = async (user_id, finished = null, search = null) => {
  try {
    let query = 'SELECT * FROM visions WHERE user_id = $1';
    const values = [user_id];
    if (search && !finished) {
      query += ' AND name LIKE $2';
      values.push(search);
    }
    if (finished && !search) {
      query += ' AND finished $2';
      values.push(finished);
    }
    if (finished && search) {
      query += ' AND finished $2 AND name LIKE $3';
      values.push(finished, search);
    }
    const results = await db.query(query, values);
    return results.rows;
  } catch (err) {
    console.error('Error selecting visions:', err);
    throw err;
  }
};
