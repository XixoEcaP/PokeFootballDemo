import React, { useState } from 'react';
import GameField from './GameField';
import TeamSelectionMenu from './TeamSelectionMenu';
import './Site.css';

const Site = () => {
  const [score, setScore] = useState({ team1: 0, team2: 0 });
  const [playerTeam, setPlayerTeam] = useState(null);
  const [aiTeam, setAITeam] = useState(null);

  const handleKeyPress = (key) => {
    const event = new KeyboardEvent('keydown', { key });
    window.dispatchEvent(event);
  };

  return (
    <div className="container">
      <h1 className="title">PokeFootball</h1>
      {playerTeam && aiTeam ? (
        <>
          <div className="scoreboard">
            <p className="score">Team 1: {score.team1}</p>
            <p className="score">Team 2: {score.team2}</p>
          </div>
          <GameField setScore={setScore} playerTeam={playerTeam} aiTeam={aiTeam} />
          <ul className="instructions">
            <li className="instruction">"a" change player</li>
            <li className="instruction">"s" shoot</li>
            <li className="instruction">"w" pass</li>
            <li className="instruction">"q" cross shoot</li>
          </ul>
          <div className="controls">
            <div className="directional-buttons">
              <button onClick={() => handleKeyPress('ArrowUp')}>↑</button>
              <div className="horizontal-buttons">
                <button onClick={() => handleKeyPress('ArrowLeft')}>←</button>
                <button onClick={() => handleKeyPress('ArrowRight')}>→</button>
              </div>
              <button onClick={() => handleKeyPress('ArrowDown')}>↓</button>
            </div>
            <div className="action-buttons">
              <button onClick={() => handleKeyPress('w')}>Pass</button>
              <button onClick={() => handleKeyPress('s')}>Shoot</button>
              <button onClick={() => handleKeyPress('q')}>Cross</button>
              <button onClick={() => handleKeyPress('a')}>Change</button>
            </div>
          </div>
        </>
      ) : (
        <TeamSelectionMenu setPlayerTeam={setPlayerTeam} setAITeam={setAITeam} />
      )}
    </div>
  );
};

export default Site;







