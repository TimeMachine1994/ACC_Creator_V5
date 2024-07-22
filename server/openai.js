 const OpenAI = require('openai');
require('dotenv').config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateProjectIdea() {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Generate a creative project idea:" }],
    max_tokens: 100,
  });
  return completion.choices[0].message.content.trim();
}

async function generateGoalSuggestion(projectName) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `Suggest a goal for the project "${projectName}":` }],
    max_tokens: 50,
  });
  return completion.choices[0].message.content.trim();
}

module.exports = { generateProjectIdea, generateGoalSuggestion };
