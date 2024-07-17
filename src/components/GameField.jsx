import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Player from './Player';
import AIPlayer from './AIPlayer';
import Ball from './Ball';
import field from '../assets/field.png';

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
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const GameField = ({ setScore, playerTeam, aiTeam }) => {
  const initialPlayerPositions = [
    { id: 1, type: playerTeam.forward.split('.')[0], x: 7, y: 2, direction: 0, hasBall: false },
    { id: 2, type: playerTeam.goalkeeper.split('.')[0], x: 1, y: 7, direction: 0, hasBall: false }
  ];

  const initialAIPositions = [
    { id: 3, type: aiTeam.goalkeeper.split('.')[0], x: 20, y: 7, direction: 0, hasBall: false, role: 'goalkeeper' },
    { id: 4, type: aiTeam.forward.split('.')[0], x: 14, y: 12, direction: 1, hasBall: false, role: 'forward' }
  ];

  const initialBallPosition = { x: 11, y: 7, direction: 0, possessedBy: null };

  const [players, setPlayers] = useState(initialPlayerPositions);
  const [aiPlayers, setAIPlayers] = useState(initialAIPositions);
  const [ball, setBall] = useState(initialBallPosition);
  const [activePlayerId, setActivePlayerId] = useState(1);
  const [goalScored, setGoalScored] = useState(false);
  const [goalkeeperPosition, setGoalkeeperPosition] = useState({ x: 20, y: 7 });
  const [movementInterval, setMovementInterval] = useState(null);

  const updateGoalkeeperPosition = (position) => {
    setGoalkeeperPosition(position);
  };

  const isWalkable = (x, y) => {
    return walkableMap[y] && walkableMap[y][x] !== 0;
  };

  const resetPositions = () => {
    setPlayers(initialPlayerPositions);
    setAIPlayers(initialAIPositions);
    setBall({ ...initialBallPosition, possessedBy: null });
  };

  const checkGoal = useCallback(() => {
    const { x, y } = ball;
    const tileValue = walkableMap[y][x];

    if (!goalScored && (tileValue === 2 || tileValue === 3)) {
      setGoalScored(true);
      if (tileValue === 2) {
        setScore(score => ({ ...score, team1: score.team1 + 1 }));
        console.log(`Goal for team 1!`);
      } else {
        setScore(score => ({ ...score, team2: score.team2 + 1 }));
        console.log(`Goal for team 2!`);
      }
      setTimeout(() => {
        resetPositions();
        setGoalScored(false);
      }, 1000); // Delay for 1 second before resetting positions
    } 
  }, [ball, goalScored, resetPositions, setScore]);

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
  }, []);

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
      setBall(ball => ({ ...ball, x: otherPlayer.x+1, y: otherPlayer.y + 1, possessedBy: otherPlayer.id }));
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

  const isGoalkeeperBlocking = (newBallX, newBallY) => {
    const { x: goalkeeperX, y: goalkeeperY } = goalkeeperPosition;
    return newBallY === goalkeeperY && newBallX >= goalkeeperX;
  };

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

    if (isGoalkeeperBlocking(newBallX, newBallY)) {
      if (Math.random() > 0) { 
      newBallX = 20; // Stop ball at x = 20 if goalkeeper is blocking
    }}

    setBall(ball => ({ ...ball, x: newBallX, y: newBallY, possessedBy: null }));
    updatePlayerBallPossession(activePlayerId, false);
  }, [ball.direction, ball.x, ball.y, activePlayerId, goalkeeperPosition]);

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

    if (isGoalkeeperBlocking(newBallX, newBallY)) {
      newBallX = 20; // Stop ball at x = 20 if goalkeeper is blocking
    }

    setBall(ball => ({ ...ball, x: newBallX, y: newBallY, possessedBy: null }));
    updatePlayerBallPossession(activePlayerId, false);
  }, [ball.direction, ball.x, ball.y, activePlayerId, goalkeeperPosition]);

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
        if (ball.possessedBy !== null && ball.possessedBy !== 3 && ball.possessedBy !== 4) {
          shootBallDiagonally();
        }
        return;
      case 'a': // Change control while not having the ball
        if (ball.possessedBy === null || ball.possessedBy === 3 || ball.possessedBy === 4) {
          changeControl();
        }
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

  const handleKeyUp = useCallback((e) => {
    if (movementInterval) {
      clearInterval(movementInterval);
      setMovementInterval(null);
    }
  }, [movementInterval]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkGoal();
    }, 100);

    return () => clearInterval(intervalId);
  }, [checkGoal]);

  return (
    <Field className="game-field">
      {players.map(player => (
        <Player key={player.id} type={player.type} x={player.x} y={player.y} direction={player.direction} hasBall={player.hasBall} />
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
          setAIPlayerPosition={updateAIPlayerPosition}
          walkableMap={walkableMap}
          goalScored={goalScored}
        />
      ))}
      <Ball x={ball.x} y={ball.y} direction={ball.direction} />
    </Field>
  );
};

export default GameField;





















