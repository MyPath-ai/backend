const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generate_ai_tasks = async (goal_description) => {
  const prompt = `Please provide a straight-forward, clear, and actionable step-by-step (maximum 10) plan to achieve the following goal: ${goal_description}`;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      n: 1,
      // stop: ['\n', 'and'], // Adjust later
    });
    console.log(response.choices[0].message.content);
    if (response && response.choices.length > 0) {
      const tasksText = response.choices[0].message.content.trim();
      const tasks = tasksText.split('\n').filter((task) => task.trim().length > 0)
        .map((task) => task.replace(/^\d+\.\s*/, '').trim());
      return {
        error: false,
        tasks,
      };
    }
    return {
      error: true,
      message: 'No tasks were generated',
    };
  } catch (error) {
    console.error('Error generating tasks with OpenAI:', error);
    throw error;
  }
};
