// App.js
import React, { useState, useEffect } from "react";
import "./App.css";

const months = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const days = [
  "monday", "tuesday", "wednesday", "thursday",
  "friday", "saturday", "sunday",
];

const romanNumerals = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"
];

const chessLetters = ["K", "Q", "R", "B", "N", "P"];

const isMathEquation = (str) => {
  const match = str.match(/([0-9+\-*/().\s]+)=([0-9]+)/);
  if (!match) return false;
  try {
    const expr = match[1];
    const result = Number(match[2]);
    return eval(expr) === result;
  } catch {
    return false;
  }
};
const getLocalTime = () => {
  const now = new Date();
  const hours = `${now.getHours()}`.padStart(2, "0");
  const minutes = `${now.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
};

function App() {
  const [password, setPassword] = useState("");
  const [maxRevealedRuleId, setMaxRevealedRuleId] = useState(0);
  const lower = password.toLowerCase();
  const digitSum = [...password]
    .filter((c) => /\d/.test(c))
    .reduce((sum, d) => sum + Number(d), 0);

  const allRules = [
    { id: 1, text: "At least 5 characters", valid: password.length >= 5 },
    { id: 2, text: "Include a number", valid: /\d/.test(password) },
    {
      id: 3,
      text: "Include an uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      id: 4,
      text: "Include a lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      id: 5,
      text: "Include a special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
    { id: 6, text: "Digits must add up to 25", valid: digitSum === 25 },
    {
      id: 7,
      text: "Include a month name",
      valid: months.some((m) => lower.includes(m)),
    },
    {
      id: 8,
      text: "Include a day of the week",
      valid: days.some((d) => lower.includes(d)),
    },
    {
      id: 9,
      text: "Include a chess piece letter (K, Q, R, B, N, P)",
      valid: chessLetters.some((ch) => password.includes(ch)),
    },
    {
      id: 10,
      text: "Balanced parentheses",
      valid: (() => {
        let count = 0;
        for (let char of password) {
          if (char === "(") count++;
          else if (char === ")") count--;
          if (count < 0) return false;
        }
        return count === 0;
      })(),
    },
    {
      id: 11,
      text: "Include a country flag emoji",
      valid: /[\u{1F1E6}-\u{1F1FF}]{2}/u.test(password),
    },
    {
      id: 12,
      text: "Include a Roman numeral (I, II, X, etc.)",
      valid: romanNumerals.some((r) =>
        password.toUpperCase().includes(r)
      ),
    },
    {
      id: 13,
      text: "Include a valid math equation (e.g. 2+3=5)",
      valid: password.includes("=") && isMathEquation(password),
    },
    {
      id: 14,
      text: "No repeated characters",
      valid: new Set(password).size === password.length,
    },
    {
      id: 15,
      text: `Include local time (${getLocalTime()})`,
      valid: password.includes(getLocalTime()),
    },
  ];

  useEffect(() => {
    const firstInvalidRuleId =
      allRules.find((rule) => !rule.valid)?.id || allRules.length + 1;
    if (firstInvalidRuleId > maxRevealedRuleId) {
      setMaxRevealedRuleId(firstInvalidRuleId);
    }
  }, [password]);

  const visibleRules = allRules
    .filter((rule) => rule.id <= maxRevealedRuleId)
    .sort((a, b) => {
      if (a.valid === b.valid) {
        return b.id - a.id; // Descending order by rule number
      }
      return a.valid ? 1 : -1; // Invalid rules first
    });

  const completedRules = visibleRules.filter((r) => r.valid).length;
  const progress = Math.round((completedRules / allRules.length) * 100);

  return (
    <div className="App">
      <h1>🔐 LockQuest</h1>
      <input
        type="text"
        placeholder="Start typing your password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onPaste={(e) => e.preventDefault()}
      />

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="progress-text">Progress: {progress}%</p>

      <ul className="rules-list">
        {visibleRules.map((rule) => (
          <li
            key={rule.id}
            className={`rule-item ${rule.valid ? "valid" : "invalid"} ${
              rule.id <= maxRevealedRuleId ? "active" : ""
            }`}
            style={{ animationDelay: `${(rule.id - 1) * 0.1}s` }}
          >
            <strong className="rule-icon-wrapper">
              <span className="rule-icon">{rule.valid ? "✔️" : "❌"}</span> Rule{" "}
              {rule.id}:
            </strong>{" "}
            {rule.text}
          </li>
        ))}
      </ul>

      {visibleRules.length === 15 && visibleRules.every((r) => r.valid) && (
        <h2 className="success-msg">🎉 All rules passed! You win!</h2>
      )}
    </div>
  );
}

export default App;
