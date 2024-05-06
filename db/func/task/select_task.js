const db = require('../pool');

exports.select_tasks = async (goal_id, finished = null, search = null) => {
  try {
    let query = 'SELECT * FROM tasks WHERE goal_id = $1';
    const values = [goal_id];
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
    const { rows } = await db.query(query, values);
    return rows;
  } catch (err) {
    console.error('Error selecting Tasks:', err);
    throw err;
  }
};
