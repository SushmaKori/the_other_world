// Require necessary modules
const express = require('express');
const fetch = require('node-fetch');
const ejs = require('ejs');

// Set up app
const app = express();
app.set('view engine', 'ejs');

// Set up Google Maps API
app.get('/', (req, res) => {
  res.render('index', { apiKey: 'https://opentdb.com/api.php?amount=10' });
});

// Fetch trivia questions
app.get('/trivia', async (req, res) => {
  const url = 'https://opentdb.com/api.php?amount=10&type=multiple';
  const response = await fetch(url);
  const data = await response.json();
  const questions = data.results.map(result => {
    return {
      question: result.question,
      options: result.incorrect_answers.concat(result.correct_answer).sort(),
      answer: result.correct_answer
    };
  });
  res.render('trivia', { questions });
});

// Check answers function
app.post('/trivia', (req, res) => {
  const answers = req.body;
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    const answer = answers[`question-${i}`];
    if (answer === questions[i].answer) {
      score++;
    }
  }
  res.render('score', { score, total: questions.length });
});

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
