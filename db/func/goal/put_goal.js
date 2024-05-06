const db = require('../pool');

exports.put_goal = async (goal) => {
  const {
    id, vision_id, name, prompt, start_date, due_date, finished, updated_at,
  } = goal;
  try {
    const text = 'UPDATE goals SET name = $2, prompt = $3, start_date = $4, due_date = $5, finished = $6, updated_at = $7 WHERE id = $1 AND vision_id = $8 RETURNING *';
    const values = [
      id,
      name,
      prompt,
      start_date,
      due_date,
      finished,
      updated_at,
      vision_id,
    ];
    const results = await db.query(text, values);
    return results.rows[0];
  } catch (err) {
    console.error('Error updating Goal:', err);
    throw err;
  }
};
