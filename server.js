require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { processUserInput } = require('./backend/agent');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Placeholder route for agent Q&A
app.post('/api/agent', async (req, res) => {
  try {
    const userAnswers = req.body.userAnswers;
    const response = await processUserInput(userAnswers);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Agent error', details: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 