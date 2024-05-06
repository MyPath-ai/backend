const Joi = require('joi');
const { insert_task } = require('../db/func/task/insert_task');
const { select_tasks } = require('../db/func/task/select_task');
const { put_task } = require('../db/func/task/put_task');
const { delete_task } = require('../db/func/task/delete_task');
const { check_task_existence } = require('../db/func/task/check_task_existence');

exports.create_task = async (req, res) => {
  try {
    const schema = Joi.object({
      goal_id: Joi.number().required(),
      tasks: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        start_date: Joi.date().allow(null),
        due_date: Joi.date().allow(null),
        finished: Joi.boolean(),
      })).required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
      });
    }
    const { goal_id, tasks } = value;

    const taskPromises = tasks.map((task) => insert_task({
      goal_id,
      ...task,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Concurrent
    await Promise.all(taskPromises);

    return res.status(200).json({
      error: false,
      message: 'Create Task: Succeed',
    });
  } catch (err) {
    console.error('Create Task Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Create Task',
    });
  }
};

exports.show_tasks = async (req, res) => {
  try {
    const schema = Joi.object({
      goal_id: Joi.number().required(),
      finished: Joi.boolean().allow(null),
      search: Joi.string(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
      });
    }
    const { goal_id, finished, search } = value;
    const tasks_raw = await select_tasks(goal_id, finished, search);
    if (!tasks_raw[0]) {
      return res.status(200).json({
        error: false,
        found: false,
        message: 'Task Data Fetch: No Data Found',
        tasks: [],
      });
    }
    const tasks = tasks_raw.map((task) => {
      const {
        id,
        name,
        start_date,
        due_date,
        created_at,
        updated_at,
      } = task;
      return {
        id,
        goal_id,
        name,
        start_date,
        due_date,
        finished,
        created_at,
        updated_at,
      };
    });
    return res.status(200).json({
      error: false,
      found: true,
      message: 'Tasks Data Fetch: Succeed',
      tasks,
    });
  } catch (err) {
    console.error('Show Tasks Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Tasks',
    });
  }
};

exports.update_task = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      goal_id: Joi.number().required(),
      name: Joi.string().required(),
      start_date: Joi.date().allow(null),
      due_date: Joi.date().allow(null),
      finished: Joi.boolean(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
      });
    }
    const {
      id, goal_id, name, start_date, due_date, finished,
    } = value;
    const updatedTask = await put_task({
      id,
      goal_id,
      name,
      start_date,
      due_date,
      finished,
      updated_at: new Date(),
    });
    return res.status(200).json({
      error: false,
      message: 'Update Task: Succeed',
      updatedTask,
    });
  } catch (err) {
    console.error('Update Task Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Update Task',
    });
  }
};

exports.delete_task = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      goal_id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
      });
    }
    const { id, goal_id } = value;
    const taskExists = await check_task_existence(id, goal_id);
    if (!taskExists) {
      return res.status(404).json({
        error: true,
        message: 'Task not found or does not belong to goal',
      });
    }
    await delete_task(id, goal_id);
    return res.status(200).json({
      error: false,
      message: 'Delete Task: Succeed',
    });
  } catch (err) {
    console.error('Delete Task Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Delete Task',
    });
  }
};
