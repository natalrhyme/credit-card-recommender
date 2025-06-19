# Credit Card Recommender System

A web-based, agent-powered credit card recommendation system for Indian users. This project leverages Google Gemini LLMs and a curated card database to guide users through a personalized Q&A journey and suggest the best-fit credit cards based on their preferences.

---

## 🚀 Features

- **Conversational Agent (LLM-Powered)**
  - Built using Google Gemini API (`@google/genai`)
  - Dynamic, context-aware Q&A: monthly income, spending habits, preferred benefits, existing cards, credit score
  - Stores user answers for context-aware dialogue
- **Card Database**
  - 20+ Indian credit cards (JSON)
  - Each card: name, issuer, joining/annual fee, reward type/rate, eligibility, perks, image, apply link
- **Recommendation Engine**
  - Filters and ranks cards based on user profile
  - Uses Gemini to generate key reasons and reward simulation for each recommendation
  - Returns top 3 best-fit cards
- **Frontend Web UI (React, PWA-ready)**
  - Chat-based or guided form-like interface (to be implemented)
  - Post-conversation summary screen with card recommendations
  - Option to compare cards or restart flow
  - Mobile responsive
- **API-First Design**
  - `/api/agent` endpoint for Q&A and recommendations

---

## 🏗️ Architecture

- **Backend**: Node.js, Express, Gemini LLM, static JSON card DB
- **Frontend**: React (PWA template), fetches from backend API
- **LLM Integration**: Gemini API for Q&A and personalized explanations
- **Card DB**: Easily extensible, add more cards in `card_db.json`

---

## 🛠️ Tech Stack
- Node.js, Express
- Google Gemini LLM (`@google/genai`)
- React (Create React App, PWA template)
- JSON for card data
- dotenv for config

---

## 📝 Setup Instructions

### 1. Backend
1. `cd build using ai/credit-card-recommender`
2. `npm install`
3. Create a `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   FRONTEND_URL=http://localhost:3000
   PORT=5000
   ```
4. `npm start`

### 2. Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

---

## 🔌 API Usage

### POST `/api/agent`
- **Request body:** `{ userAnswers: { income, spending, benefits, existing_cards, credit_score } }`
- **Response:**
  - If more info needed: `{ nextQuestion: string, recommendations: [] }`
  - If ready: `{ nextQuestion: null, recommendations: [ { name, reasons, reward_simulation, ... } ] }`

---

## 📦 Card Database Structure (`card_db.json`)
```json
[
  {
    "name": "HDFC Regalia Credit Card",
    "issuer": "HDFC Bank",
    "joining_fee": 2500,
    "annual_fee": 2500,
    "reward_type": "Reward Points",
    "reward_rate": "4 points per Rs. 150",
    "eligibility": "Income > Rs. 1 lakh/month",
    "perks": ["Lounge Access", "Dining Discounts", "Travel Insurance"],
    "apply_link": "https://www.hdfcbank.com/apply/regalia",
    "image": "regalia.png"
  },
  ...
]
```

---

## 🧠 How It Works
1. User starts a chat or guided form on the frontend
2. Backend agent asks dynamic questions, stores answers
3. When enough info is collected, backend filters and ranks cards
4. Gemini LLM generates personalized reasons and reward simulation for each card
5. Frontend displays recommendations, allows comparison or restart

---

## 🛣️ Roadmap / To Do
- [ ] Build chat UI and summary/compare screens
- [ ] Add more advanced card filtering (spending, benefits, credit score)
- [ ] Improve reward simulation logic
- [ ] Add user session/history support
- [ ] Polish mobile UX

---

## 🤝 Contributing
PRs and suggestions welcome! Expand the card DB, improve the agent, or help with the frontend.

---

## 📄 License
MIT 