const db = require('../pool');

exports.insertUser = async (user) => {
  const {
    name, nickname, email, password, created_at, updated_at,
  } = user;

  try {
    const text = 'INSERT INTO users (name, nickname, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
    const values = [
      name,
      nickname,
      email,
      password,
      created_at,
      updated_at,
    ];
    const results = await db.query(text, values);
    return results.rows[0];
  } catch (err) {
    console.error('Error inserting user:', err);
    throw err;
  }
};
