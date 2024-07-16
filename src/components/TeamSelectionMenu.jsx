import React, { useState } from 'react';

const teams = {
  Fire: { forward: 'arcanine.png', goalkeeper: 'charizard.png' },
  Grass: { forward: 'bulbasaur.png', goalkeeper: 'vileplume.png' },
  Poison: { forward: 'gengar.png', goalkeeper: 'nidoking.png' },
  Thunder: { forward: 'pikachu.png', goalkeeper: 'jolteon.png' },
  Water: { forward: 'psyduck.png', goalkeeper: 'blastoise.png' }
};

const TeamSelectionMenu = ({ setPlayerTeam, setAITeam }) => {
  const [playerTeam, setPlayerTeamLocal] = useState('Poison');
  const [aiTeam, setAITeamLocal] = useState('Fire');

  const handleStartGame = () => {
    setPlayerTeam(teams[playerTeam]);
    setAITeam(teams[aiTeam]);
  };

  return (
    <div className="team-selection-menu">
      <h2>Select Teams</h2>
      <div>
        <label>Player Team: </label>
        <select value={playerTeam} onChange={(e) => setPlayerTeamLocal(e.target.value)}>
          {Object.keys(teams).map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Rival Team: </label>
        <select value={aiTeam} onChange={(e) => setAITeamLocal(e.target.value)}>
          {Object.keys(teams).map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
};

export default TeamSelectionMenu;



