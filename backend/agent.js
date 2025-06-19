// agent.js

const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const cardDbPath = path.join(__dirname, '../card_db.json');
const cardDb = JSON.parse(fs.readFileSync(cardDbPath, 'utf-8'));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const QUESTION_FLOW = [
  { key: 'income', question: 'What is your monthly income (in INR)?' },
  { key: 'spending', question: 'What are your top spending categories? (fuel, travel, groceries, dining, etc.)' },
  { key: 'benefits', question: 'What benefits do you prefer? (cashback, travel points, lounge access, etc.)' },
  { key: 'existing_cards', question: 'Do you have any existing credit cards? (optional)' },
  { key: 'credit_score', question: 'What is your approximate credit score? (or type "unknown")' }
];

function getNextQuestion(userAnswers) {
  for (const q of QUESTION_FLOW) {
    if (!userAnswers[q.key]) return q.question;
  }
  return null;
}

function filterAndRankCards(userAnswers) {
  // Simple filtering logic for demo; can be improved with LLM
  let filtered = cardDb;
  if (userAnswers.income) {
    filtered = filtered.filter(card => {
      if (!card.eligibility) return true;
      const incomeMatch = card.eligibility.match(/\d[\d,]*/g);
      if (!incomeMatch) return true;
      const minIncome = parseInt(incomeMatch[0].replace(/,/g, ''));
      return parseInt(userAnswers.income) >= minIncome;
    });
  }
  // Further filtering based on spending/benefits can be added

  return filtered.splice(0, 3);
}

async function callGemini(messages) {
  try {
      // Check if API key exists
      if (!process.env.GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY is not set in environment variables');
      }

      // Log the initialization
      console.log('Initializing Gemini API...');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      // Gemini expects a single string prompt, so concatenate messages
      const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      console.log('Sending prompt to Gemini:', prompt);

      const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt
      });

      // Extract the generated text from the response object
      // The response object has a 'candidates' array, each with a 'content.parts' array containing 'text'
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No text found in Gemini response');
      }
      console.log('Received response from Gemini');
      return text;
  } catch (error) {
      console.error('Error in callGemini:', error.message);
      if (error.response) {
          console.error('API Response:', error.response.data);
      }
      throw error;
  }
}

async function processUserInput(userAnswers) {
  const nextQuestion = getNextQuestion(userAnswers);
  if (nextQuestion) {
    return { nextQuestion, recommendations: [] };
  }
  // All questions answered, generate recommendations
  const topCards = filterAndRankCards(userAnswers);
  // Use Gemini to generate reasons and reward simulation
  const messages = [
    { role: 'system', content: 'You are a helpful assistant recommending Indian credit cards.' },
    { role: 'user', content: `
  User profile: ${JSON.stringify(userAnswers)}.
  Eligible cards: ${JSON.stringify(topCards)}.
  From these, select the top 3 best matching cards for the user, based on their profile and preferences.
  For each card, explain why it is a good fit and simulate annual rewards based on the user profile.
  Respond in JSON array format with fields: name, reasons, reward_simulation.
  ` }
  ];
  let recommendations = [];
  try {
    const llmResponse = await callGemini(messages);
    recommendations = JSON.parse(llmResponse);
  } catch (e) {
    // fallback: basic reasons
    recommendations = topCards.map(card => ({
      name: card.name,
      reasons: [`Matches your income and preferences.`],
      reward_simulation: 'Simulation not available.'
    }));
  }
  return { nextQuestion: null, recommendations };
}

module.exports = { processUserInput }; 