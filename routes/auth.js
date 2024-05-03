const express = require('express');
const auth_controller = require('../controllers/auth.js');

const router = express.Router();

/**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: John Doe
 *               nickname:
 *                 type: string
 *                 description: Nickname for the user
 *                 example: Johnny
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *                 example: 'securePassword123'
 *               password_confirm:
 *                 type: string
 *                 description: Confirmation of the password
 *                 example: 'securePassword123'
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Register: Succeed'
 *       400:
 *         description: Bad request due to validation error or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Bad Request: Validation or Email Used'
 *       401:
 *         description: Unauthorized due to invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized: Invalid API KEY'
 *       500:
 *         description: Server error during registration process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Server Error: Register'
 */
router.post('/register', auth_controller.register);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authenticate a user and provide a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: '12345678'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Login successful'
 *                 token:
 *                   type: string
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                 credentials:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: '123'
 *       400:
 *         description: Bad request due to validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Bad Request: Validation'
 *       401:
 *         description: Unauthorized due to invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized: Invalid API KEY'
 *       500:
 *         description: Server error during login process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Server Error: Login'
 */
router.post('/login', auth_controller.login);
router.post('/logout', auth_controller.logout);

module.exports = router;
