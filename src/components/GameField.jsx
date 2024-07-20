import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Player from './Player';
import AIPlayer from './AIPlayer';
import Ball from './Ball';
import field from '../assets/field.png';
import goal from '../assets/goal.png';

const TILE_SIZE = 32;
const FIELD_WIDTH = 22;
const FIELD_HEIGHT = 15;

// Define the size of the larger container
const CONTAINER_WIDTH = (FIELD_WIDTH + 4) * TILE_SIZE;
const CONTAINER_HEIGHT = (FIELD_HEIGHT + 4) * TILE_SIZE;

const Container = styled.div`
  background-image: url(${field});
  background-size: cover;
  width: ${CONTAINER_WIDTH}px;
  height: ${CONTAINER_HEIGHT}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Field = styled.div`
  width: ${FIELD_WIDTH * TILE_SIZE}px;
  height: ${FIELD_HEIGHT * TILE_SIZE}px;
  position: relative;
`;

const GoalOverlay = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${props => (props.show ? 'block' : 'none')};
  z-index: 1;
`;

const walkableMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
  [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const GameField = ({ setScore, playerTeam, aiTeam }) => {
  const initialPlayerPositions = [
    { id: 1, type: playerTeam.forward.split('.')[0], x: 7, y: 2, direction: 0, hasBall: false },
    { id: 2, type: playerTeam.goalkeeper.split('.')[0], x: 1, y: 7, direction: 0, hasBall: false }
  ];

  const initialAIPositions = [
    { id: 3, type: aiTeam.goalkeeper.split('.')[0], x: 20, y: 7, direction: 0, hasBall: false, role: 'goalkeeper' },
    { id: 4, type: aiTeam.forward.split('.')[0], x: 19, y: 12, direction: 1, hasBall: false, role: 'forward' }
  ];

  const initialBallPosition = { x: 11, y: 7, direction: 0, possessedBy: null, lastShot: false };

  const [players, setPlayers] = useState(initialPlayerPositions);
  const [aiPlayers, setAIPlayers] = useState(initialAIPositions);
  const [ball, setBall] = useState(initialBallPosition);
  const [activePlayerId, setActivePlayerId] = useState(1);
  const [goalScored, setGoalScored] = useState(false);
  const [goalOverlayVisible, setGoalOverlayVisible] = useState(false); // Add this state
  const [goalkeeperPosition, setGoalkeeperPosition] = useState({ x: 20, y: 7 });
  const [movementInterval, setMovementInterval] = useState(null);
  const [frameIndex, setFrameIndex] = useState(0);

  const updateGoalkeeperPosition = (position) => {
    setGoalkeeperPosition(position);
  };

  const isWalkable = (x, y) => {
    return walkableMap[y] && walkableMap[y][x] === 1;
  };

  const resetPositions = () => {
    setPlayers(initialPlayerPositions);
    setAIPlayers(initialAIPositions);
    setBall({ ...initialBallPosition, possessedBy: null });
  };

  const checkGoal = useCallback(() => {
    const { x, y, lastShot } = ball;
    const tileValue = walkableMap[y][x];
  
    if (!goalScored && lastShot && (tileValue === 2 || tileValue === 3)) {
      setGoalScored(true);
      setGoalOverlayVisible(true); // Show the goal overlay
      if (tileValue === 2) {
        setScore(score => ({ ...score, team1: score.team1 + 1 }));
        console.log(`Goal for team 1!`);
      } else if (tileValue === 3) {
        setScore(score => ({ ...score, team2: score.team2 + 1 }));
        console.log(`Goal for team 2!`);
      }
      setTimeout(() => {
        resetPositions();
        setGoalScored(false);
        setGoalOverlayVisible(false); // Hide the goal overlay after the timeout
      }, 1000); // Delay for 1 second before resetting positions
    } else {
      if (tileValue === 18) {
        // Logic for handling the ball going into tile 4
        console.log("Ball has gone into tile 4");
  
        // Move the ball to a new position
        setBall(ball => ({
          ...ball,
          y: Math.max(y - 1, 0), // Example logic: move the ball one tile up
          lastShot: false, // Reset lastShot as the ball is now in a new position
        }));
      }
      if ((tileValue === 4 || tileValue === 2) && !goalScored) {
        // Logic for handling the ball going into tile 4
    
        // Move the ball to a new position
        setBall(ball => ({
          ...ball,
          x: Math.max(x + 1, 0), // Example logic: move the ball one tile to the left
          lastShot: true, // Reset lastShot as the ball is now in a new position
        }));
      }
      if ((tileValue === 5 || tileValue === 3) && !goalScored) {
        // Logic for handling the ball going into tile 4
        console.log("Ball has gone into tile 4");
  
        // Move the ball to a new position
        setBall(ball => ({
          ...ball,
          x: Math.max(x - 1, 0), // Example logic: move the ball one tile to the left
          lastShot: true, // Reset lastShot as the ball is now in a new position
        }));
      }
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

    newBallX = Math.max(1, Math.min(FIELD_WIDTH - 2, newBallX));
    newBallY = Math.max(0, Math.min(FIELD_HEIGHT - 2, newBallY));

    setBall(ball => ({ ...ball, x: newBallX, y: newBallY, direction, lastShot: false }));
  }, []);

  const checkCollision = useCallback((playerX, playerY, playerId) => {
    if (
      playerId !== 4 && // Ensure player 4 does not possess the ball
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
      setBall(ball => ({ ...ball, x: otherPlayer.x + 1, y: otherPlayer.y + 1, possessedBy: otherPlayer.id, lastShot: false }));
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
    return (newBallY === goalkeeperY || newBallY === goalkeeperY + 1) && newBallX >= goalkeeperX;
  };

  const shootBallVertically = useCallback(() => {
    let newBallX = ball.x;
    let newBallY = ball.y;
    const randomDistance = Math.floor(Math.random() * 8) + 5; // Random number between 5 and 12
  
    switch (ball.direction) {
      case 0: // Down
        newBallY = Math.min(FIELD_HEIGHT - 1, ball.y + randomDistance);
        break;
      case 1: // Left
        newBallX = Math.max(0, ball.x - randomDistance);
        break;
      case 2: // Right
        newBallX = Math.min(FIELD_WIDTH - 1, ball.x + randomDistance);
        break;
      case 3: // Up
        newBallY = Math.max(0, ball.y - randomDistance);
        break;
      default:
        break;
    }
  
    if (isGoalkeeperBlocking(newBallX, newBallY)) {
      newBallX = 20; // Stop ball at x = 20 if goalkeeper is blocking
    }
  
    setBall(ball => ({ ...ball, x: newBallX, y: newBallY, possessedBy: null, lastShot: true }));
    updatePlayerBallPossession(activePlayerId, false);
  }, [ball.direction, ball.x, ball.y, activePlayerId, goalkeeperPosition]);

  const shootBallDiagonally = useCallback(() => {
    let newBallX = ball.x;
    let newBallY = ball.y;
    const fieldCenterY = Math.floor(FIELD_HEIGHT / 2);
    const randomDistance = Math.floor(Math.random() * 8) + 5; // Random number between 5 and 12
  
    if (ball.y < fieldCenterY) { // Player is in the top half of the field
      newBallY = Math.min(FIELD_HEIGHT - 1, ball.y + randomDistance); // Shoot downwards
      switch (ball.direction) {
        case 1: // Left
          newBallX = Math.max(0, ball.x - randomDistance); // Move left
          break;
        case 2: // Right
          newBallX = Math.min(FIELD_WIDTH - 1, ball.x + randomDistance); // Move right
          break;
        default:
          break;
      }
    } else { // Player is in the bottom half of the field
      newBallY = Math.max(0, ball.y - randomDistance); // Shoot upwards
      switch (ball.direction) {
        case 1: // Left
          newBallX = Math.max(0, ball.x - randomDistance); // Move left
          break;
        case 2: // Right
          newBallX = Math.min(FIELD_WIDTH - 1, ball.x + randomDistance); // Move right
          break;
        default:
          break;
      }
    }
  
    if (isGoalkeeperBlocking(newBallX, newBallY)) {
      newBallX = 20; // Stop ball at x = 20 if goalkeeper is blocking
    }
  
    setBall(ball => ({ ...ball, x: newBallX, y: newBallY, possessedBy: null, lastShot: true }));
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
        setFrameIndex((prevIndex) => (prevIndex + 1) % 4);
        break;
      case 'ArrowDown':
        newY = Math.min(FIELD_HEIGHT - 1, activePlayer.y + 1);
        newDirection = 0;
        setFrameIndex((prevIndex) => (prevIndex + 1) % 4);
        break;
      case 'ArrowLeft':
        newX = Math.max(0, activePlayer.x - 1);
        newDirection = 1;
        setFrameIndex((prevIndex) => (prevIndex + 1) % 4);
        break;
      case 'ArrowRight':
        newX = Math.min(FIELD_WIDTH - 1, activePlayer.x + 1);
        newDirection = 2;
        setFrameIndex((prevIndex) => (prevIndex + 1) % 4);
        break;
      case 'w': // Pass
        passBall();
        return;
      case 's': // Shoot vertically
        if (ball.possessedBy !== null&& ball.possessedBy !== 3 && ball.possessedBy !== 4) {
          shootBallVertically();
        }
        console.log(ball.possessedBy)
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
    <Container className="game-container">
      <Field className="game-field">
        <GoalOverlay src={goal} show={goalOverlayVisible} />
        {players.map(player => (
          <Player key={player.id} type={player.type} x={player.x} y={player.y} direction={player.direction} frameIndex={frameIndex} hasBall={player.hasBall} />
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
            aiPlayers={aiPlayers}
            updateGoalkeeperPosition={updateGoalkeeperPosition}
            updatePlayerPosition={updatePlayerPosition}
            players={players}
            setActivePlayerId={setActivePlayerId}
          />
        ))}
        <Ball x={ball.x} y={ball.y} direction={ball.direction} />
      </Field>
    </Container>
  );
};

export default GameField;



























