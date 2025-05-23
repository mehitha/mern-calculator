import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operator, setOperator] = useState('+');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/history');
      setHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const calculate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/calculate', {
        num1: parseFloat(num1),
        num2: parseFloat(num2),
        operator,
      });
      setResult(response.data.result);
      fetchHistory(); // Refresh history after calculation
    } catch (error) {
      console.error(error);
    }
  };

  const clearHistory = async () => {
    // You could implement a backend endpoint to clear history if needed
    setHistory([]);
  };

  return (
    <div className="container">
      <h2>MERN Calculator</h2>
      <div className="input-group">
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="First Number"
        />
        <select value={operator} onChange={(e) => setOperator(e.target.value)}>
          <option>+</option>
          <option>-</option>
          <option>*</option>
          <option>/</option>
        </select>
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Second Number"
        />
      </div>
      <button onClick={calculate}>Calculate</button>
      {result !== null && <h3>Result: {result}</h3>}

      {history.length > 0 && (
        <>
          <h4>History (Last 10)</h4>
          <ul>
            {history.map(({ _id, num1, num2, operator, result }) => (
              <li key={_id}>
                {num1} {operator} {num2} = {result}
              </li>
            ))}
          </ul>
          <button onClick={clearHistory}>Clear History (Frontend only)</button>
        </>
      )}
    </div>
  );
}

export default App;
