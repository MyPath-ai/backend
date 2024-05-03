const bcrypt = require('bcryptjs');
const db = require('../pool');

exports.check_login = async (email, password) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return {
        valid: false,
        message: 'Bad Request: Email Invalid',
      };
    }
    if (!await bcrypt.compare(password, rows[0].password)) {
      return {
        valid: false,
        message: 'Bad Request: Password Invalid',
      };
    }
    const { id, name, nickname } = rows[0];
    const credentials = {
      id, name, nickname, email,
    };
    return {
      valid: true,
      message: 'Login: Succeed',
      credentials,
    };
  } catch (err) {
    console.error('Error checking login: ', err);
    throw err;
  }
};
