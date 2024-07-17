import React, { useState, useEffect } from 'react';
import GameField from './GameField';
import TeamSelectionMenu from './TeamSelectionMenu';
import './Site.css';

const Site = () => {
  const [score, setScore] = useState({ team1: 0, team2: 0 });
  const [playerTeam, setPlayerTeam] = useState(null);
  const [aiTeam, setAITeam] = useState(null);
  const [pressedKey, setPressedKey] = useState(null);

  const handleKeyPress = (key) => {
    const event = new KeyboardEvent('keydown', { key });
    window.dispatchEvent(event);
    setPressedKey(key);
  };

  const handleKeyRelease = () => {
    setPressedKey(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      setPressedKey(event.key);
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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
              <button
                className={pressedKey === 'ArrowUp' ? 'pressed' : ''}
                onMouseDown={() => handleKeyPress('ArrowUp')}
                onMouseUp={handleKeyRelease}
              >
                ↑
              </button>
              <div className="horizontal-buttons">
                <button
                  className={pressedKey === 'ArrowLeft' ? 'pressed' : ''}
                  onMouseDown={() => handleKeyPress('ArrowLeft')}
                  onMouseUp={handleKeyRelease}
                >
                  ←
                </button>
                <button
                  className={pressedKey === 'ArrowRight' ? 'pressed' : ''}
                  onMouseDown={() => handleKeyPress('ArrowRight')}
                  onMouseUp={handleKeyRelease}
                >
                  →
                </button>
              </div>
              <button
                className={pressedKey === 'ArrowDown' ? 'pressed' : ''}
                onMouseDown={() => handleKeyPress('ArrowDown')}
                onMouseUp={handleKeyRelease}
              >
                ↓
              </button>
            </div>
            <div className="action-buttons">
              <button
                className={pressedKey === 'w' ? 'pressed' : ''}
                onMouseDown={() => handleKeyPress('w')}
                onMouseUp={handleKeyRelease}
              >
                Pass
              </button>
              <button
                className={pressedKey === 's' ? 'pressed' : ''}
                onMouseDown={() => handleKeyPress('s')}
                onMouseUp={handleKeyRelease}
              >
                Shoot
              </button>
              <button
                className={pressedKey === 'q' ? 'pressed' : ''}
                onMouseDown={() => handleKeyPress('q')}
                onMouseUp={handleKeyRelease}
              >
                Cross
              </button>
              <button
                className={pressedKey === 'a' ? 'pressed' : ''}
                onMouseDown={() => handleKeyPress('a')}
                onMouseUp={handleKeyRelease}
              >
                ChangeP
              </button>
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






