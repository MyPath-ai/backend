const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { check_email_existence } = require('../db/func/auth/check_email');
const { insert_user } = require('../db/func/auth/insert_user');
const { check_login } = require('../db/func/auth/check_login');
const { check_uid } = require('../db/func/auth/check_uid');

exports.register = async (req, res) => {
  try {
    const { apikey } = req.headers;
    if (!apikey) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: API KEY not Found',
      });
    }
    if (apikey !== process.env.API_KEY) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Invalid API KEY',
      });
    }
    const schema = Joi.object({
      name: Joi.string().required(),
      nickname: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      password_confirm: Joi.ref('password'),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
      });
    }
    const {
      name, nickname, email, password,
    } = value;
    const email_exist = await check_email_existence(email);
    if (email_exist) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Email Used',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    await insert_user({
      name,
      nickname,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return res.status(200).json({
      error: false,
      message: 'Register: Succeed',
    });
  } catch (err) {
    console.error('Register Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Register',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { apikey } = req.headers;
    if (apikey !== process.env.apikey) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Invalid API KEY',
      });
    }
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
      });
    }
    const { email, password } = value;
    const { valid, message, credentials } = await check_login(email, password);
    if (!valid) {
      return res.status(400).json({
        error: true,
        message,
      });
    }
    const { id } = credentials;
    const token = jwt.sign(
      { id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
    return res.status(200).json({
      error: false,
      message,
      token,
      credentials,
    });
  } catch (err) {
    console.error('Login Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Login',
    });
  }
};

// eslint-disable-next-line consistent-return
exports.token_check = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Token not found',
      });
    }

    const token = authorization.split(' ')[1];
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          reject(err);
        } else {
          resolve(decode);
        }
      });
    });
    const user_exists = await check_uid(decoded.id);
    if (user_exists) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Invalid user',
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Token expired',
      });
    } if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Token is invalid',
      });
    }
    console.error('Token Check Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Token Check',
    });
  }
};

exports.logout = async (req, res) => {
  res.cookie('usersSave', 'logout', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    error: false,
    message: 'Logout: Succeed',
  });
};
