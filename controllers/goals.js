const Joi = require('joi');
const { check_name_existence } = require('../db/func/goal/check_name_existence');
const { insert_goal } = require('../db/func/goal/insert_goal');
const { select_goals } = require('../db/func/goal/select_goal');
const { put_goal } = require('../db/func/goal/put_goal');
const { delete_goal } = require('../db/func/goal/delete_goal');
const { check_goal_existence } = require('../db/func/goal/check_goal_existence');

exports.create_goal = async (req, res) => {
  try {
    const schema = Joi.object({
      vision_id: Joi.number().required(),
      name: Joi.string().required(),
      prompt: Joi.string().required(),
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
      vision_id, name, start_date, due_date, finished,
    } = value;
    // name should be unique
    const name_exist = await check_name_existence(name);
    if (name_exist) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Vision Name Exist',
      });
    }
    await insert_goal({
      vision_id,
      name,
      start_date,
      due_date,
      finished,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return res.status(200).json({
      error: false,
      message: 'Create Goal: Succeed',
    });
  } catch (err) {
    console.error('Create Goal Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Create Goal',
    });
  }
};

exports.show_goals = async (req, res) => {
  try {
    const schema = Joi.object({
      vision_id: Joi.number().required(),
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
    const {
      vision_id, finished, search,
    } = value;
    const goals_raw = await select_goals(
      vision_id,
      finished,
      search,
    );
    if (!goals_raw[0]) {
      return res.status(200).json({
        error: false,
        found: false,
        message: 'Goal Data Fetch: No Data Found',
        goals: [],
      });
    }
    const goals = goals_raw.map((goal) => {
      const {
        id,
        name,
        start_date,
        due_date,
        created_at,
        updated_at,
      } = goal;
      return {
        id,
        vision_id,
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
      message: 'Goals Data Fetch: Succeed',
      goals,
    });
  } catch (err) {
    console.error('Show Goals Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Goals',
    });
  }
};

exports.update_goal = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      vision_id: Joi.number().required(),
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
      id, vision_id, name, start_date, due_date, finished,
    } = value;
    const name_exist = await check_name_existence(name, vision_id, id);
    if (name_exist) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Goal Name Exists in Other Goal',
      });
    }
    const updatedGoal = await put_goal({
      id,
      vision_id,
      name,
      start_date,
      due_date,
      finished,
      updated_at: new Date(),
    });
    return res.status(200).json({
      error: false,
      message: 'Update Goal: Succeed',
      updatedGoal,
    });
  } catch (err) {
    console.error('Update Goal Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Update Goal',
    });
  }
};

exports.delete_goal = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      vision_id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
      });
    }
    const {
      id, vision_id,
    } = value;
    const goalExists = await check_goal_existence(id, vision_id);
    if (!goalExists) {
      return res.status(404).json({
        error: true,
        message: 'Goal not found or does not belong to vision',
      });
    }
    await delete_goal(id, vision_id);
    return res.status(200).json({
      error: false,
      message: 'Delete Goal: Succeed',
    });
  } catch (err) {
    console.error('Delete Goal Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Delete Goal',
    });
  }
};
