const express = require('express');
const auth_controller = require('../controllers/auth.js');

const router = express.Router();

/**
 * @swagger
 * /auth/v1/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user in the system
 *     parameters:
 *       - name: apikey
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           format: password
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
 * /auth/v1/login:
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

/**
 * @swagger
 * /auth/v1/get_user:
 *   get:
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     summary: Fetch user details
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: 'John Doe'
 *                 nickname:
 *                   type: string
 *                   example: 'Johnny'
 *                 email:
 *                   type: string
 *                   example: 'user@example.com'
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
 *       500:
 *         description: Server error during user detail retrieval
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
 *                   example: 'Server Error: GetUser'
 */
router.get('/get_user', auth_controller.token_check, auth_controller.getUser);

router.post('/logout', auth_controller.logout);

module.exports = router;
