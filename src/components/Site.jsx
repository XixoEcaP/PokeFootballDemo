import React, { useState, useEffect } from 'react';
import GameField from './GameField';
import TeamSelectionMenu from './TeamSelectionMenu';
import Loader from './Loader';
import './Site.css';

const Site = () => {
  const [score, setScore] = useState({ team1: 0, team2: 0 });
  const [playerTeam, setPlayerTeam] = useState(null);
  const [aiTeam, setAITeam] = useState(null);
  const [pressedKey, setPressedKey] = useState(null);
  const [playerTeamName, setPlayerTeamName] = useState('');
  const [aiTeamName, setAITeamName] = useState('');
  const [loading, setLoading] = useState(true);

  const handleKeyPress = (key) => {
    const event = new KeyboardEvent('keydown', { key });
    window.dispatchEvent(event);
    setPressedKey(key);
  };

  const handleKeyRelease = (key) => {
    const event = new KeyboardEvent('keyup', { key });
    window.dispatchEvent(event);
    setPressedKey(null);
  };

  useEffect(() => {
    // Simulate loading delay (e.g., fetching data or images)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <h1 className="title">PokeFootball</h1>
      {playerTeam && aiTeam ? (
        <>
          <div className="scoreboard">
            <p className="score">{playerTeamName} : {score.team2}</p>
            <p className="score">{aiTeamName} : {score.team1}</p>
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
                onMouseUp={() => handleKeyRelease('ArrowUp')}
              >
                ↑
              </button>
              <div className="horizontal-buttons">
                <button
                  className={pressedKey === 'ArrowLeft' ? 'pressed' : ''}
                  onMouseDown={() => handleKeyPress('ArrowLeft')}
                  onMouseUp={() => handleKeyRelease('ArrowLeft')}
                >
                  ←
                </button>
                <button
                  className={pressedKey === 'ArrowRight' ? 'pressed' : ''}
                  onMouseDown={() => handleKeyPress('ArrowRight')}
                  onMouseUp={() => handleKeyRelease('ArrowRight')}
                >
                  →
                </button>
              </div>
              <button
                className={pressedKey === 'ArrowDown' ? 'pressed' : ''}
                onMouseDown={() => handleKeyPress('ArrowDown')}
                onMouseUp={() => handleKeyRelease('ArrowDown')}
              >
                ↓
              </button>
            </div>
            <div className="action-buttons">
              <button
                className={pressedKey === 'w' ? 'pressed' : ''}
                onMouseDown={() => handleKeyPress('w')}
                onMouseUp={() => handleKeyRelease('w')}
              >
                Pass
              </button>
              <button
                className={pressedKey === 's' ? 'pressed' : ''}
                onMouseDown={() => handleKeyPress('s')}
                onMouseUp={() => handleKeyRelease('s')}
              >
                Shoot
              </button>
              <button
                className={pressedKey === 'q' ? 'pressed' : ''}
                onMouseDown={() => handleKeyPress('q')}
                onMouseUp={() => handleKeyRelease('q')}
              >
                Cross
              </button>
              <button
                className={pressedKey === 'a' ? 'pressed' : ''}
                onMouseDown={() => handleKeyPress('a')}
                onMouseUp={() => handleKeyRelease('a')}
              >
                ChangeP
              </button>
            </div>
          </div>
        </>
      ) : (
        <TeamSelectionMenu 
          setPlayerTeam={setPlayerTeam} 
          setAITeam={setAITeam} 
          setPlayerTeamName={setPlayerTeamName}
          setAITeamName={setAITeamName} 
        />
      )}
    </div>
  );
};

export default Site;









