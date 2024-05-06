const express = require('express');
const goals_controller = require('../controllers/goals.js');
const { token_check } = require('../controllers/auth.js');

const router = express.Router();

/**
 * @swagger
 * /goal/v1/create:
 *   post:
 *     tags:
 *       - Goals
 *     summary: Create a new goal for a vision
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vision_id:
 *                 type: number
 *                 description: ID of the vision this goal belongs to
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Name of the goal
 *                 example: "Finish frontend module"
 *               prompt:
 *                 type: string
 *                 description: Prompt or description for the goal
 *                 example: "Complete the React components"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the goal
 *                 example: "2024-02-01"
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: Due date of the goal
 *                 example: "2024-03-01"
 *               finished:
 *                 type: boolean
 *                 description: Completion status of the goal
 *                 example: false
 *     responses:
 *       200:
 *         description: Goal created successfully
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
 *                   example: "Create Goal: Succeed"
 *       400:
 *         description: Bad request due to validation or goal name exists
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
 *                   example: "Bad Request: Validation or Goal Name Exist"
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
 *         description: Server error during goal creation
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
 *                   example: "Server Error: Create Goal"
 */
router.post('/create', token_check, goals_controller.create_goal);

/**
 * @swagger
 * /goal/v1/show:
 *   get:
 *     tags:
 *       - Goals
 *     summary: Show all goals based on vision and filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: vision_id
 *         schema:
 *           type: number
 *         required: true
 *         description: The ID of the vision whose goals are to be displayed
 *       - in: query
 *         name: finished
 *         schema:
 *           type: boolean
 *         description: Filter for the completion status of the goals
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter the goals
 *     responses:
 *       200:
 *         description: Successfully retrieved goals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 found:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Goals Data Fetch: Succeed"
 *                 goals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Finish frontend module"
 *                       start_date:
 *                         type: string
 *                         format: date
 *                         example: "2024-02-01"
 *                       due_date:
 *                         type: string
 *                         format: date
 *                         example: "2024-03-01"
 *                       finished:
 *                         type: boolean
 *                         example: false
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
 *                   example: "Bad Request: Validation"
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
 *         description: Server error during goals retrieval
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
 *                   example: "Server Error: Show Goals"
 */
router.get('/show', token_check, goals_controller.show_goals);

/**
 * @swagger
 * /goal/v1/update:
 *   put:
 *     tags:
 *       - Goals
 *     summary: Update an existing goal
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: Goal ID to update
 *                 example: 1
 *               vision_id:
 *                 type: number
 *                 description: Vision ID of the goal
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Updated name of the goal
 *                 example: "Complete backend module"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Updated start date of the goal
 *                 example: "2024-02-10"
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: Updated due date of the goal
 *                 example: "2024-04-01"
 *               finished:
 *                 type: boolean
 *                 description: Updated status of the goal
 *                 example: true
 *     responses:
 *       200:
 *         description: Goal updated successfully
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
 *                   example: "Update Goal: Succeed"
 *                 updatedGoal:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Complete backend module"
 *                     start_date:
 *                       type: string
 *                       format: date
 *                       example: "2024-02-10"
 *                     due_date:
 *                       type: string
 *                       format: date
 *                       example: "2024-04-01"
 *                     finished:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request due to validation error or goal name exists
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
 *                   example: "Bad Request: Validation or Goal Name Exists in Other Goal"
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
 *       404:
 *         description: Goal not found or does not belong to vision
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
 *                   example: "Goal not found or does not belong to vision"
 *       500:
 *         description: Server error during goal update
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
 *                   example: "Server Error: Update Goal"
 */
router.put('/update', token_check, goals_controller.update_goal);

/**
 * @swagger
 * /goal/v1/delete:
 *   delete:
 *     tags:
 *       - Goals
 *     summary: Delete a goal by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The ID of the goal to be deleted
 *       - in: query
 *         name: vision_id
 *         schema:
 *           type: number
 *         required: true
 *         description: The vision ID associated with the goal
 *     responses:
 *       200:
 *         description: Goal deleted successfully
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
 *                   example: "Delete Goal: Succeed"
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
 *       404:
 *         description: Goal not found or does not belong to vision
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
 *                   example: "Goal not found or does not belong to vision"
 *       500:
 *         description: Server error during goal deletion
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
 *                   example: "Server Error: Delete Goal"
 */
router.delete('/delete', token_check, goals_controller.delete_goal);

module.exports = router;
