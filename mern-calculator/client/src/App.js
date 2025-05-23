// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';  // import the CSS you just created

// --- Calculator Component ---
function Calculator() {
  const [input, setInput] = useState('');

  const handleClick = (value) => setInput(input + value);
  const handleClear = () => setInput('');
  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(input);
      setInput(String(result));
    } catch {
      setInput('Error');
    }
  };

  const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','C','+'];

  return (
    <div className="app-container">
      <h2>Basic Calculator</h2>
      <input
        type="text"
        value={input}
        readOnly
        style={{ textAlign: 'right' }}
      />
      <div className="calc-grid">
        {buttons.map(btn => (
          <button
            key={btn}
            className="calc-btn"
            onClick={() => btn === 'C' ? handleClear() : handleClick(btn)}
          >
            {btn}
          </button>
        ))}
        <button className="calc-btn calc-equal-btn" onClick={handleCalculate}>=</button>
      </div>
    </div>
  );
}

// --- Calculator Speed Challenge Component ---
// (Same as before, but wrapped in app-container and with buttons styled)

const OPERATORS = ['+', '-', '*', '/'];

function getRandomNumber(min = 1, max = 20) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  const num1 = getRandomNumber();
  const num2 = getRandomNumber();
  const operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
  if (operator === '/' && num2 === 0) return generateQuestion();

  let answer;
  switch (operator) {
    case '+': answer = num1 + num2; break;
    case '-': answer = num1 - num2; break;
    case '*': answer = num1 * num2; break;
    case '/': answer = parseFloat((num1 / num2).toFixed(2)); break;
    default: answer = null;
  }
  return { question: `${num1} ${operator} ${num2}`, answer };
}

function CalculatorSpeedChallenge() {
  const [questionData, setQuestionData] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionCount, setQuestionCount] = useState(1);
  const maxQuestions = 10;
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [questionData]);

  useEffect(() => {
    if (timeLeft === 0) {
      nextQuestion();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const nextQuestion = () => {
    if (questionCount >= maxQuestions) {
      alert(`Game over! Your score: ${score}/${maxQuestions}`);
      resetGame();
      return;
    }
    setQuestionData(generateQuestion());
    setUserAnswer('');
    setTimeLeft(10);
    setQuestionCount(questionCount + 1);
  };

  const resetGame = () => {
    setScore(0);
    setQuestionCount(1);
    setQuestionData(generateQuestion());
    setUserAnswer('');
    setTimeLeft(10);
  };

  const checkAnswer = () => {
    const parsedAnswer = parseFloat(userAnswer);
    if (isNaN(parsedAnswer)) {
      alert('Please enter a valid number!');
      return;
    }
    if (Math.abs(parsedAnswer - questionData.answer) < 0.01) {
      setScore(score + 1);
    }
    nextQuestion();
  };

  return (
    <div className="app-container">
      <h2>Calculator Speed Challenge</h2>
      <p>Question {questionCount} / {maxQuestions}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{questionData.question}</p>
      <input
        ref={inputRef}
        type="number"
        value={userAnswer}
        onChange={e => setUserAnswer(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') checkAnswer(); }}
        placeholder="Your answer"
      />
      <button onClick={checkAnswer}>Submit</button>
      <p>Time left: {timeLeft} seconds</p>
      <p>Score: {score}</p>
      <button onClick={resetGame} className="reset-btn">Reset Game</button>
    </div>
  );
}

// --- Math Quiz Game Component ---
const quizQuestions = [
  { question: "What is 5 + 7?", options: ["10", "11", "12", "13"], answer: "12" },
  { question: "What is 9 - 3?", options: ["5", "6", "7", "8"], answer: "6" },
  { question: "What is 6 * 2?", options: ["11", "12", "13", "14"], answer: "12" },
];

function MathQuizGame() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (option) => {
    if (option === quizQuestions[current].answer) {
      setScore(score + 1);
    }
    setCurrent(current + 1);
  };

  if (current >= quizQuestions.length) {
    return (
      <div className="app-container">
        <h2>Math Quiz Game</h2>
        <p>Your Score: {score} / {quizQuestions.length}</p>
        <button onClick={() => { setCurrent(0); setScore(0); }}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2>Math Quiz Game</h2>
      <p>{quizQuestions[current].question}</p>
      {quizQuestions[current].options.map(option => (
        <button
          key={option}
          onClick={() => handleAnswer(option)}
          style={{ margin: '5px', width: '45%', fontSize: '1.1rem' }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

// --- Number Guessing Game ---
function NumberGuessingGame() {
  const [target] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a number between 1 and 100');
  const [attempts, setAttempts] = useState(0);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 100) {
      setMessage('Enter a valid number between 1 and 100');
      return;
    }
    setAttempts(attempts + 1);
    if (num === target) {
      setMessage(`Correct! You guessed in ${attempts + 1} attempts.`);
    } else if (num < target) {
      setMessage('Too low!');
    } else {
      setMessage('Too high!');
    }
    setGuess('');
  };

  const resetGame = () => {
    setGuess('');
    setMessage('Guess a number between 1 and 100');
    setAttempts(0);
  };

  return (
    <div className="app-container">
      <h2>Number Guessing Game</h2>
      <p>{message}</p>
      <input
        type="number"
        value={guess}
        onChange={e => setGuess(e.target.value)}
        placeholder="Your guess"
        onKeyDown={e => { if (e.key === 'Enter') handleGuess(); }}
      />
      <button onClick={handleGuess}>Guess</button>
      <button onClick={resetGame} className="reset-btn">Reset Game</button>
    </div>
  );
}

// --- Memory Card Game Component ---
const cardsData = [
  { id: 1, value: 'A' }, { id: 2, value: 'A' },
  { id: 3, value: 'B' }, { id: 4, value: 'B' },
  { id: 5, value: 'C' }, { id: 6, value: 'C' },
  { id: 7, value: 'D' }, { id: 8, value: 'D' },
];

function MemoryCardGame() {
  const [cards, setCards] = useState(shuffle(cardsData));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  const flipCard = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedIds.includes(cards[index].id)) return;
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];
      if (firstCard.value === secondCard.value) {
        setMatchedIds([...matchedIds, firstCard.id, secondCard.id]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(shuffle(cardsData));
    setFlippedCards([]);
    setMatchedIds([]);
  };

  return (
    <div className="app-container">
      <h2>Memory Card Game</h2>
      <div className="memory-grid">
        {cards.map((card, index) => {
          const isFlipped = flippedCards.includes(index) || matchedIds.includes(card.id);
          return (
            <div
              key={index}
              onClick={() => flipCard(index)}
              className={`memory-card ${isFlipped ? 'flipped' : ''}`}
            >
              {isFlipped ? card.value : ''}
            </div>
          );
        })}
      </div>
      <button onClick={resetGame} className="reset-btn">Reset Game</button>
    </div>
  );
}

// --- Main App ---
export default function App() {
  return (
    <Router>
      <div>
        <h1>Fun Math & Puzzle Games</h1>
        <nav>
          <Link to="/">Calculator</Link>
          <Link to="/speed">Speed Challenge</Link>
          <Link to="/quiz">Math Quiz</Link>
          <Link to="/guess">Number Guess</Link>
          <Link to="/memory">Memory Game</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/speed" element={<CalculatorSpeedChallenge />} />
          <Route path="/quiz" element={<MathQuizGame />} />
          <Route path="/guess" element={<NumberGuessingGame />} />
          <Route path="/memory" element={<MemoryCardGame />} />
        </Routes>
      </div>
    </Router>
  );
}
