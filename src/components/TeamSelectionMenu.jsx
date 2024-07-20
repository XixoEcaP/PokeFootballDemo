import React, { useState } from 'react';

const teams = {
  Poison: { forward: 'gengar.png', goalkeeper: 'nidoking.png' },
  Fire: { forward: 'arcanine.png', goalkeeper: 'charizard.png' },
  Grass: { forward: 'venusaur.png', goalkeeper: 'exeggutor.png' },
  Water: { forward: 'blastoise.png', goalkeeper: 'slowbro.png' },
  Normal: { forward: 'tauros.png', goalkeeper: 'snorlax.png' },
  Thunder: { forward: 'jolteon.png', goalkeeper: 'pikachu.png' },
  Bug: { forward: 'scyther.png', goalkeeper: 'butterfree.png' },
  Rock: { forward: 'onix.png', goalkeeper: 'golem.png' },
  Ground: { forward: 'marowak.png', goalkeeper: 'sandslash.png' },
  Psichic: { forward: 'alakazam.png', goalkeeper: 'mrmime.png' },
  Ice: { forward: 'lapras.png', goalkeeper: 'jynx.png' },
  Flying: { forward: 'dragonite.png', goalkeeper: 'aerodactyl.png' },
  Dark: { forward: 'houndoom.png', goalkeeper: 'tyranitar.png' }
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



