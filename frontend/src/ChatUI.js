import React, { useState } from 'react';

const initialMessages = [
  { sender: 'bot', text: 'Welcome! I can help you find the best credit card. Ready to begin? (Type yes to start)' }
];

export default function ChatUI() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [awaitingAnswer, setAwaitingAnswer] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const sendMessage = async (text) => {
    setMessages((msgs) => [...msgs, { sender: 'user', text }]);
    let updatedAnswers = { ...userAnswers };
    if (!awaitingAnswer && text.toLowerCase().includes('yes')) {
      // Start the Q&A
      setAwaitingAnswer(true);
      await fetchNext({});
      return;
    }
    if (awaitingAnswer) {
      // Guess which question is being answered
      const lastBotMsg = messages.filter(m => m.sender === 'bot').slice(-1)[0]?.text || '';
      if (lastBotMsg.toLowerCase().includes('income')) updatedAnswers.income = text;
      else if (lastBotMsg.toLowerCase().includes('spending')) updatedAnswers.spending = text;
      else if (lastBotMsg.toLowerCase().includes('benefit')) updatedAnswers.benefits = text;
      else if (lastBotMsg.toLowerCase().includes('existing')) updatedAnswers.existing_cards = text;
      else if (lastBotMsg.toLowerCase().includes('credit score')) updatedAnswers.credit_score = text;
      setUserAnswers(updatedAnswers);
      await fetchNext(updatedAnswers);
    }
  };

  const fetchNext = async (answers) => {
    const res = await fetch('http://localhost:5000/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAnswers: answers })
    });
    const data = await res.json();
    if (data.nextQuestion) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: data.nextQuestion }]);
      setAwaitingAnswer(true);
    } else if (data.recommendations && data.recommendations.length > 0) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Here are your top credit card recommendations:' }]);
      setRecommendations(data.recommendations);
      setAwaitingAnswer(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="chat-ui">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'bot' ? 'bot-msg' : 'user-msg'}>
            {msg.text}
          </div>
        ))}
        {recommendations.length > 0 && (
          <div className="recommendations">
            {recommendations.map((rec, i) => (
              <div key={i} className="card-recommendation">
                <strong>{rec.name}</strong>
                <div>Reasons: {Array.isArray(rec.reasons) ? rec.reasons.join(', ') : rec.reasons}</div>
                <div>Reward Simulation: {rec.reward_simulation}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <form className="chat-input" onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your answer..."
          disabled={recommendations.length > 0}
        />
        <button type="submit" disabled={recommendations.length > 0}>Send</button>
      </form>
    </div>
  );
} 