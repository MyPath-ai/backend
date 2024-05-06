/* eslint-disable max-len */
const express = require('express');
const { generate_task } = require('../controllers/ai.js');
const { token_check } = require('../controllers/auth.js');

const router = express.Router();

/**
 * @swagger
 * /ai/v1/generate:
 *   post:
 *     tags:
 *       - AI
 *     summary: Generate a detailed plan for a given goal using AI
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: A descriptive prompt for the goal for which tasks need to be generated
 *                 example: "Plan a 3-day local conference for 100 participants"
 *     responses:
 *       200:
 *         description: Task generation successful
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
 *                   example: "Generate Task: Succeed"
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Book a venue for the conference"
 *       400:
 *         description: Bad request due to validation error or prompt issues
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
 *                   example: "Bad Request: Validation or Generating Task Failed, Bad Prompt"
 *       401:
 *         description: Unauthorized due to Token Problem
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
 *                   example: "Unauthorized: Token expired"
 *       500:
 *         description: Server error during task generation
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
 *                   example: "Server Error: Generate Task"
 */
router.post('/generate', token_check, generate_task);

module.exports = router;
