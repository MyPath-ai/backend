const Joi = require('joi');

const { check_name_existence } = require('../db/func/vision/check_name_existence');
const { insert_vision } = require('../db/func/vision/insert_vision');
const { select_visions } = require('../db/func/vision/select_vision');
const { put_vision } = require('../db/func/vision/put_vision');
const { delete_vision } = require('../db/func/vision/delete_vision');
const { check_vision_existence } = require('../db/func/vision/check_vision_existence');

exports.create_vision = async (req, res) => {
  try {
    const schema = Joi.object({
      user_id: Joi.number().required(),
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
      user_id, name, start_date, due_date, finished,
    } = value;
    // name should be unique
    const name_exist = await check_name_existence(name);
    if (name_exist) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Vision Name Exist',
      });
    }
    await insert_vision({
      user_id,
      name,
      start_date,
      due_date,
      finished,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return res.status(200).json({
      error: false,
      message: 'Create Vision: Succeed',
    });
  } catch (err) {
    console.error('Create Vision Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Create Vision',
    });
  }
};

exports.show_visions = async (req, res) => {
  try {
    const schema = Joi.object({
      user_id: Joi.number().required(),
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
      user_id, finished, search,
    } = value;
    const visions_raw = await select_visions(
      user_id,
      finished,
      search,
    );
    if (!visions_raw[0]) {
      return res.status(200).json({
        error: false,
        found: false,
        message: 'Vision Data Fetch: No Data Found',
        visions: [],
      });
    }
    const visions = visions_raw.map((vision) => {
      const {
        id,
        name,
        start_date,
        due_date,
        created_at,
        updated_at,
      } = vision;
      return {
        id,
        user_id,
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
      message: 'Visions Data Fetch: Succeed',
      visions,
    });
  } catch (err) {
    console.error('Show Visions Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Visions',
    });
  }
};

exports.update_vision = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      user_id: Joi.number().required(),
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
      id, user_id, name, start_date, due_date, finished,
    } = value;
    const name_exist = await check_name_existence(name, user_id, id);
    if (name_exist) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Vision Name Exists in Other Vision',
      });
    }
    const updatedVision = await put_vision({
      id,
      user_id,
      name,
      start_date,
      due_date,
      finished,
      updated_at: new Date(),
    });
    return res.status(200).json({
      error: false,
      message: 'Update Vision: Succeed',
      updatedVision,
    });
  } catch (err) {
    console.error('Update Vision Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Update Vision',
    });
  }
};

exports.delete_vision = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      user_id: Joi.number().required(),

    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
      });
    }
    const {
      id, user_id,
    } = value;
    const visionExists = await check_vision_existence(id, user_id);
    if (!visionExists) {
      return res.status(404).json({
        error: true,
        message: 'Vision not found or does not belong to user',
      });
    }
    await delete_vision(id, user_id);
    return res.status(200).json({
      error: false,
      message: 'Delete Vision: Succeed',
    });
  } catch (err) {
    console.error('Delete Vision Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Delete Vision',
    });
  }
};
