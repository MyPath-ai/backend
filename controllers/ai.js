const Joi = require('joi');
const { generate_ai_tasks } = require('../utilities/generate_ai_tasks');

exports.generate_task = async (req, res) => {
  try {
    const schema = Joi.object({
      prompt: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
      });
    }
    const { prompt } = value;
    const results = await generate_ai_tasks(prompt);
    if (results.error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Generating Task Failed, Bad Prompt',
      });
    }
    return res.status(200).json({
      error: false,
      message: 'Generate Task: Succeed',
      tasks: results.tasks,
    });
  } catch (err) {
    console.error('Generate Task Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Generate Task',
    });
  }
};
