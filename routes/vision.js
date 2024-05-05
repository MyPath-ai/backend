const express = require('express');
const visions_controller = require('../controllers/visions.js');
const { token_check } = require('../controllers/auth.js');

const router = express.Router();

/**
 * @swagger
 * /vision/v1/create:
 *   post:
 *     tags:
 *       - Visions
 *     summary: Create a new vision for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *                 description: User ID of the vision owner
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Name of the vision
 *                 example: "Build a new app"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the vision
 *                 example: "2024-01-01"
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: Due date of the vision
 *                 example: "2024-12-31"
 *               finished:
 *                 type: boolean
 *                 description: Status of the vision
 *                 example: false
 *     responses:
 *       200:
 *         description: Vision created successfully
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
 *                   example: "Create Vision: Succeed"
 *       400:
 *         description: Bad request due to validation or vision name exists
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
 *                   example: "Bad Request: Validation or Vision Name Exist"
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
 *         description: Server error during vision creation
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
 *                   example: "Server Error: Create Vision"
 */
router.post('/create', token_check, visions_controller.create_vision);

/**
 * @swagger
 * /vision/v1/show:
 *   get:
 *     tags:
 *       - Visions
 *     summary: Show all visions based on user and filters
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: number
 *         required: true
 *         description: The ID of the user whose visions are to be displayed
 *       - in: query
 *         name: finished
 *         schema:
 *           type: boolean
 *         description: Filter for the completion status of the visions
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter the visions
 *     responses:
 *       200:
 *         description: Successfully retrieved visions
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
 *                   example: "Visions Data Fetch: Succeed"
 *                 visions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Build a new app"
 *                       start_date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-01"
 *                       due_date:
 *                         type: string
 *                         format: date
 *                         example: "2024-12-31"
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
 *         description: Server error during visions retrieval
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
 *                   example: "Server Error: Show Visions"
 */
router.get('/show', visions_controller.show_visions);

/**
 * @swagger
 * /vision/v1/update:
 *   put:
 *     tags:
 *       - Visions
 *     summary: Update an existing vision
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: Vision ID to update
 *                 example: 1
 *               user_id:
 *                 type: number
 *                 description: User ID of the vision owner
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Updated name of the vision
 *                 example: "Build an awesome app"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Updated start date of the vision
 *                 example: "2024-02-01"
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: Updated due date of the vision
 *                 example: "2024-11-30"
 *               finished:
 *                 type: boolean
 *                 description: Updated status of the vision
 *                 example: true
 *     responses:
 *       200:
 *         description: Vision updated successfully
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
 *                   example: "Update Vision: Succeed"
 *                 updatedVision:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Build an awesome app"
 *                     start_date:
 *                       type: string
 *                       format: date
 *                       example: "2024-02-01"
 *                     due_date:
 *                       type: string
 *                       format: date
 *                       example: "2024-11-30"
 *                     finished:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request due to validation error or name exists
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
 *                   example: "Bad Request: Validation or Vision Name Exists in Other Vision"
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
 *         description: Vision not found or does not belong to user
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
 *                   example: "Vision not found or does not belong to user"
 *       500:
 *         description: Server error during vision update
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
 *                   example: "Server Error: Update Vision"
 */
router.put('/update', visions_controller.update_vision);

/**
 * @swagger
 * /vision/v1/delete:
 *   delete:
 *     tags:
 *       - Visions
 *     summary: Delete a vision by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The ID of the vision to be deleted
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: number
 *         required: true
 *         description: The user ID of the owner of the vision
 *     responses:
 *       200:
 *         description: Vision deleted successfully
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
 *                   example: "Delete Vision: Succeed"
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
 *         description: Vision not found or does not belong to user
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
 *                   example: "Vision not found or does not belong to user"
 *       500:
 *         description: Server error during vision deletion
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
 *                   example: "Server Error: Delete Vision"
 */
router.delete('/delete', visions_controller.delete_vision);

module.exports = router;
