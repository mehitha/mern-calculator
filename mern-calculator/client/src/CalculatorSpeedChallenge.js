import React, { useState, useEffect, useRef } from 'react';

const OPERATORS = ['+', '-', '*', '/'];

function getRandomNumber(min = 1, max = 20) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  const num1 = getRandomNumber();
  const num2 = getRandomNumber();
  const operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];

  // Avoid division by zero
  if (operator === '/' && num2 === 0) return generateQuestion();

  // Round division result to 2 decimal places
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

export default function CalculatorSpeedChallenge() {
  const [questionData, setQuestionData] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds per question
  const [questionCount, setQuestionCount] = useState(1);
  const maxQuestions = 10;
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input when new question loads
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
    let parsedAnswer = parseFloat(userAnswer);
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
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20, textAlign: 'center', fontFamily: 'Arial' }}>
      <h2>Calculator Speed Challenge</h2>
      <p>Question {questionCount} of {maxQuestions}</p>
      <h3>{questionData.question}</h3>
      <input
        type="number"
        step="any"
        ref={inputRef}
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Your answer"
        style={{ padding: 10, fontSize: 16, width: '80%' }}
        onKeyDown={(e) => { if (e.key === 'Enter') checkAnswer(); }}
      />
      <br />
      <button onClick={checkAnswer} style={{ marginTop: 10, padding: '10px 20px' }}>
        Submit
      </button>
      <p>Time left: {timeLeft}s</p>
      <p>Score: {score}</p>
    </div>
  );
}
