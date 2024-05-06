const express = require('express');
const tasks_controller = require('../controllers/tasks.js');
const { token_check } = require('../controllers/auth.js');

const router = express.Router();

/**
 * @swagger
 * /task/v1/create:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create new tasks associated with a specific goal
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goal_id:
 *                 type: number
 *                 description: ID of the goal this task belongs to
 *                 example: 1
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the task
 *                       example: "Design database schema"
 *                     start_date:
 *                       type: string
 *                       format: date
 *                       description: Start date of the task
 *                       example: "2024-02-01"
 *                     due_date:
 *                       type: string
 *                       format: date
 *                       description: Due date of the task
 *                       example: "2024-03-01"
 *                     finished:
 *                       type: boolean
 *                       description: Completion status of the task
 *                       example: false
 *     responses:
 *       200:
 *         description: Tasks created successfully
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
 *                   example: "Create Task: Succeed"
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
 *         description: Server error during task creation
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
 *                   example: "Server Error: Create Task"
 */
router.post('/create', token_check, tasks_controller.create_task);

/**
 * @swagger
 * /task/v1/show:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Show all tasks based on goal and filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: goal_id
 *         schema:
 *           type: number
 *         required: true
 *         description: The ID of the goal whose tasks are to be displayed
 *       - in: query
 *         name: finished
 *         schema:
 *           type: boolean
 *         description: Filter for the completion status of the tasks
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter the tasks
 *     responses:
 *       200:
 *         description: Successfully retrieved tasks
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
 *                   example: "Tasks Data Fetch: Succeed"
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Design database schema"
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
 *         description: Server error during tasks retrieval
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
 *                   example: "Server Error: Show Tasks"
 */
router.get('/show', token_check, tasks_controller.show_tasks);

/**
 * @swagger
 * /task/v1/update:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Update an existing task
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
 *                 description: Task ID to update
 *                 example: 1
 *               goal_id:
 *                 type: number
 *                 description: Goal ID of the task
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Updated name of the task
 *                 example: "Update database schema"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Updated start date of the task
 *                 example: "2024-02-10"
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: Updated due date of the task
 *                 example: "2024-04-01"
 *               finished:
 *                 type: boolean
 *                 description: Updated status of the task
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated successfully
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
 *                   example: "Update Task: Succeed"
 *                 updatedTask:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Update database schema"
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
 *         description: Bad request due to validation error or task name exists
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
 *                   example: "Bad Request: Validation or Task Name Exists in Other Task"
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
 *         description: Task not found or does not belong to goal
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
 *                   example: "Task not found or does not belong to goal"
 *       500:
 *         description: Server error during task update
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
 *                   example: "Server Error: Update Task"
 */
router.put('/update', token_check, tasks_controller.update_task);

/**
 * @swagger
 * /task/v1/delete:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete a task by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The ID of the task to be deleted
 *       - in: query
 *         name: goal_id
 *         schema:
 *           type: number
 *         required: true
 *         description: The goal ID associated with the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
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
 *                   example: "Delete Task: Succeed"
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
 *         description: Task not found or does not belong to goal
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
 *                   example: "Task not found or does not belong to goal"
 *       500:
 *         description: Server error during task deletion
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
 *                   example: "Server Error: Delete Task"
 */
router.delete('/delete', token_check, tasks_controller.delete_task);

module.exports = router;
