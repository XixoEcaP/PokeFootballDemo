import React, { useState } from 'react';
import GameField from './GameField';
import './Site.css'; // Import the CSS file

const Site = () => {
  const [score, setScore] = useState({ team1: 0, team2: 0 });

  return (
    <div className="container">
      <h1 className="title">PokeFootball</h1>
      <div className="scoreboard">
        <p className="score">Team 1: {Math.ceil(score.team2)}</p>
        <p className="score">Team 2: {Math.ceil(score.team1)}</p>
      </div>
      <GameField setScore={setScore}className="game-field" />
      <ul className="instructions">
        <li className="instruction">"a" change player</li>
        <li className="instruction">"s" shoot</li>
        <li className="instruction">"w" pass</li>
        <li className="instruction">"q" cross shoot</li>
        <li className="instruction" id ="mobile">Only playable through Desktop</li>
      </ul>
    </div>
  );
};

export default Site;


