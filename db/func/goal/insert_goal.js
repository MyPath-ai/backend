const db = require('../pool');

exports.insert_goal = async (goal) => {
  const {
    vision_id, name, prompt, start_date, due_date, finished, created_at, updated_at,
  } = goal;

  try {
    const text = 'INSERT INTO goals (vision_id, name, prompt, start_date, due_date, finished, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [
      vision_id,
      name,
      prompt,
      start_date,
      due_date,
      finished,
      created_at,
      updated_at,
    ];
    const results = await db.query(text, values);
    return results.rows[0];
  } catch (err) {
    console.error('Error inserting Goal:', err);
    throw err;
  }
};
