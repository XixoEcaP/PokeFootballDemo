import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Player from './Player';
import AIPlayer from './AIPlayer';
import Ball from './Ball';
import field from '../assets/field.png';

import './GameField.css';

const TILE_SIZE = 32;
const FIELD_WIDTH = 22;
const FIELD_HEIGHT = 15;

const Field = styled.div`
  background-image: url(${field});
  background-size: cover;
  width: ${FIELD_WIDTH * TILE_SIZE}px;
  height: ${FIELD_HEIGHT * TILE_SIZE}px;
  position: relative;
`;

const walkableMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const GameField = ({ setScore }) => {
  const [players, setPlayers] = useState([
    { id: 1, x: 1, y: 1, direction: 0, hasBall: true },
    { id: 2, x: 5, y: 1, direction: 0, hasBall: false },
  ]);
  const [aiPlayers, setAIPlayers] = useState([
    { id: 3, type: 'charizard', x: 18, y: 10, direction: 0, hasBall: false, role: 'defender' },
    { id: 4, type: 'pikachu', x: 6, y: 8, direction: 1, hasBall: false, role: 'forward' },
  ]);
  const [activePlayerId, setActivePlayerId] = useState(1);
  const [ball, setBall] = useState({ x: 1, y: 1, direction: 0, possessedBy: 1 });

  const isWalkable = (x, y) => {
    return walkableMap[y] && walkableMap[y][x] !== 0;
  };

  const [goalScored, setGoalScored] = useState(false);

  const checkGoal = useCallback((x, y) => {
    const tileValue = walkableMap[y][x];
    
    if (!goalScored && tileValue === 2) {
      setGoalScored(true);
      setBall({ x: Math.floor(FIELD_WIDTH / 2), y: Math.floor(FIELD_HEIGHT / 2), direction: 0, possessedBy: null });
      setGoalScored(false); // Reset goal flag after ball reset
      setTimeout(() => {  
      setScore(score => {
        const newScore = { ...score, team1: score.team1 + 0.5 };
        console.log(`Goal for team 1! Score: Team 1 - ${newScore.team1}, Team 2 - ${newScore.team2}`);
        return newScore;
      }, 200);
         
       // Delay in milliseconds for resetting the ball position
       
      });
    } else if (!goalScored && tileValue === 3) {
      setGoalScored(true);
      setScore(score => {
        const newScore = { ...score, team2: score.team2 + 0.5 };
        console.log(`Goal for team 2! Score: Team 1 - ${newScore.team1}, Team 2 - ${newScore.team2}`);
        setTimeout(() => {
          setBall({ x: Math.floor(FIELD_WIDTH / 2), y: Math.floor(FIELD_HEIGHT / 2), direction: 0, possessedBy: null });
          setGoalScored(false); // Reset goal flag after ball reset
        }, 200); // Delay in milliseconds for resetting the ball position
        return newScore;
      });
    }
  }, [walkableMap, setScore, setBall, goalScored, setGoalScored, FIELD_WIDTH, FIELD_HEIGHT]);
  
  
  
  
  const handleTileValue = useCallback((x, y) => {
    const tileValue = walkableMap[y][x]; // Assuming walkableMap is defined somewhere
    
    if (tileValue === 2 || tileValue === 3) {
      setBall({
        x: Math.floor(FIELD_WIDTH / 2),
        y: Math.floor(FIELD_HEIGHT / 2),
        direction: 0,
        possessedBy: null
      });
    }
  }, [setBall]); // Ensure setBall is a dependency in useCallback
  


  // Other functions and event handlers remain the same

  const updatePlayerPosition = useCallback((id, x, y, direction) => {
    if (!isWalkable(x, y)) return;
    setPlayers(players => players.map(player =>
      player.id === id ? { ...player, x, y, direction } : player
    ));
  }, []);

  const updateAIPlayerPosition = useCallback((id, x, y, direction) => {
    if (!isWalkable(x, y)) return;
    setAIPlayers(aiPlayers => aiPlayers.map(player =>
      player.id === id ? { ...player, x, y, direction } : player
    ));
  }, []);

  const setBallPositionInFrontOfPlayer = useCallback((playerX, playerY, direction) => {
    let newBallX = playerX;
    let newBallY = playerY;
   

    switch (direction) {
      case 0: // Down
        newBallY += 1;
        break;
      case 1: // Left
        newBallX -= 1;
        newBallY += 1;
        break;
      case 2: // Right
        newBallX += 1;
        newBallY += 1;
        break;
      case 3: // Up
        newBallY -= 1;
        break;
      default:
        break;
    }

    newBallX = Math.max(0, Math.min(FIELD_WIDTH - 1, newBallX));
    newBallY = Math.max(0, Math.min(FIELD_HEIGHT - 1, newBallY));

   

    setBall(ball => ({ ...ball, x: newBallX, y: newBallY, direction }));
  }, [checkGoal]);

  const checkCollision = useCallback((playerX, playerY, playerId) => {
    if (
      Math.abs(playerX - ball.x) <= 1 &&
      Math.abs(playerY - ball.y) <= 1
    ) {
      setBall(ball => ({ ...ball, possessedBy: playerId }));
      updatePlayerBallPossession(playerId, true);
      setActivePlayerId(playerId);
    }
  }, [ball.x, ball.y]);

  const passBall = useCallback(() => {
    const activePlayer = players.find(player => player.id === activePlayerId);
    const otherPlayer = players.find(player => player.id !== activePlayerId);

    if (ball.possessedBy === activePlayer.id) {
      setBall(ball => ({ ...ball, x: otherPlayer.x, y: otherPlayer.y, possessedBy: otherPlayer.id }));
      updatePlayerBallPossession(activePlayer.id, false);
      updatePlayerBallPossession(otherPlayer.id, true);
      setActivePlayerId(otherPlayer.id);
    }
  }, [activePlayerId, players, ball.possessedBy]);

  const updatePlayerBallPossession = useCallback((id, hasBall) => {
    if (id < 3) {
      setPlayers(players => players.map(player =>
        player.id === id ? { ...player, hasBall } : player
      ));
    } else {
      setAIPlayers(aiPlayers => aiPlayers.map(player =>
        player.id === id ? { ...player, hasBall } : player
      ));
    }
  }, []);

  const shootBallVertically = useCallback(() => {
    let newBallX = ball.x;
    let newBallY = ball.y;

    switch (ball.direction) {
      case 0: // Down
        newBallY = Math.min(FIELD_HEIGHT - 1, ball.y + 7);
        break;
      case 1: // Left
        newBallX = Math.max(0, ball.x - 7);
        break;
      case 2: // Right
        newBallX = Math.min(FIELD_WIDTH - 1, ball.x + 7);
        break;
      case 3: // Up
        newBallY = Math.max(0, ball.y - 7);
        break;
      default:
        break;
    }



    setBall(ball => ({ ...ball, x: newBallX, y: newBallY, possessedBy: null }));
    updatePlayerBallPossession(activePlayerId, false);
  }, [ball.direction, ball.x, ball.y, activePlayerId, checkGoal]);

  const shootBallDiagonally = useCallback(() => {
    let newBallX = ball.x;
    let newBallY = ball.y;
    const fieldCenterY = Math.floor(FIELD_HEIGHT / 2);
  
    if (ball.y < fieldCenterY) { // Player is in the top half of the field
      newBallY = Math.min(FIELD_HEIGHT - 1, ball.y + 7); // Shoot downwards
      switch (ball.direction) {
        case 1: // Left
          newBallX = Math.max(0, ball.x - 7); // Move left
          break;
        case 2: // Right
          newBallX = Math.min(FIELD_WIDTH - 1, ball.x + 7); // Move right
          break;
        default:
          break;
      }
    } else { // Player is in the bottom half of the field
      newBallY = Math.max(0, ball.y - 7); // Shoot upwards
      switch (ball.direction) {
        case 1: // Left
          newBallX = Math.max(0, ball.x - 7); // Move left
          break;
        case 2: // Right
          newBallX = Math.min(FIELD_WIDTH - 1, ball.x + 7); // Move right
          break;
        default:
          break;
      }
    }
  
    setBall(ball => ({ ...ball, x: newBallX, y: newBallY, possessedBy: null }));
    updatePlayerBallPossession(activePlayerId, false);

  }, [ball.direction, ball.x, ball.y, activePlayerId, checkGoal]);
  

  const changeControl = useCallback(() => {
    setActivePlayerId(activePlayerId === 1 ? 2 : 1);
  }, [activePlayerId]);

  const handleKeyDown = useCallback((e) => {
    let activePlayer = players.find(player => player.id === activePlayerId);
    let newX = activePlayer.x;
    let newY = activePlayer.y;
    let newDirection = activePlayer.direction;

    switch (e.key) {
      
      
      case 'ArrowUp':
        
        newY = Math.max(0, activePlayer.y - 1);
        newDirection = 3;
        break;
      case 'ArrowDown':
      
        newY = Math.min(FIELD_HEIGHT - 1, activePlayer.y + 1);
        newDirection = 0;
        break;
      case 'ArrowLeft':
      
        newX = Math.max(0, activePlayer.x - 1);
        newDirection = 1;
        break;
      case 'ArrowRight':
      
        newX = Math.min(FIELD_WIDTH - 1, activePlayer.x + 1);
        newDirection = 2;
        break;
      case 'w': // Pass
        passBall();
        return;
      case 's': // Shoot vertically
        if (ball.possessedBy !== null) {
          shootBallVertically();
        }
        return;
      case 'q': // Shoot diagonally
        if (ball.possessedBy !== null) {
          shootBallDiagonally();
        }
        return;
        case 'a': // Change control while not having the ball
        if (ball.possessedBy === null || ball.possessedBy === 3|| ball.possessedBy === 4) {
          changeControl();
        }
        console.log(`Ball possessed by player ${ball.possessedBy}`);
        return;
      default:
        
        return;
    }

    updatePlayerPosition(activePlayer.id, newX, newY, newDirection);

    if (ball.possessedBy === activePlayer.id) {
      setBallPositionInFrontOfPlayer(newX, newY, newDirection);
    } else {
      checkCollision(newX, newY, activePlayer.id);
    }
  }, [
    activePlayerId,
    players,
    ball.possessedBy,
    passBall,
    shootBallVertically,
    shootBallDiagonally,
    changeControl,
    updatePlayerPosition,
    setBallPositionInFrontOfPlayer,
    checkCollision
  ]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  
  return (
    <Field class = "game-field">
     {players.map(player => (
        <Player key={player.id} type={player.id === 1 ? "gengar" : "nidoking"} x={player.x} y={player.y} direction={player.direction} hasBall={player.hasBall} />
      ))}
      {aiPlayers.map(player => (
        <AIPlayer
          key={player.id}
          id={player.id}
          type={player.type}
          initialX={player.x}
          initialY={player.y}
          role={player.role}
          ball={ball}
          setBall={setBall}
          forwardPosition={aiPlayers.find(p => p.id === 4)}
          setAIPlayerPosition={() => {}}
          walkableMap={walkableMap} // Pass walkableMap as a prop
          checkGoal={checkGoal} // Pass checkGoal as a prop
        
        />
      ))}
      <Ball x={ball.x} y={ball.y} direction={ball.direction} />
    </Field>
  );
};

export default GameField;






















