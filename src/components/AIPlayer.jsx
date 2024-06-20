import React, { useState, useEffect, useCallback } from 'react';
import Player from './Player';
import pikachu from '../assets/pikachu.png';
import charizard from '../assets/charizard.png';

const FIELD_WIDTH = 22;
const FIELD_HEIGHT = 15;

const walkableMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
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

const isWalkable = (x, y) => {
  return walkableMap[y] && walkableMap[y][x] === 1;
};

const AIPlayer = ({ id, type, initialX, initialY, role, ball, setBall, forwardPosition, setAIPlayerPosition, checkGoal }) => {
  const sprite = type === 'pikachu' ? pikachu : charizard;

  const [player, setPlayer] = useState({
    id,
    x: initialX,
    y: initialY,
    direction: 0,
    hasBall: false
  });

  const [actionInProgress, setActionInProgress] = useState(false);
  const [waitingForBall, setWaitingForBall] = useState(false);

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

    setBall(ball => ({ ...ball, x: Math.max(0, Math.min(FIELD_WIDTH - 1, newBallX)), y: Math.max(0, Math.min(FIELD_HEIGHT - 1, newBallY)), direction }));
  }, [setBall]);

  const checkCollision = useCallback((playerX, playerY) => {
    if (
      Math.abs(playerX - ball.x) <= 1 &&
      Math.abs(playerY - ball.y) <= 1
    ) {
      setBall(ball => ({ ...ball, possessedBy: player.id }));
      setPlayer(player => ({ ...player, hasBall: true }));
      setWaitingForBall(false);
    }
  }, [ball.x, ball.y, setBall, player.id]);

  const passBallToForward = useCallback(() => {
    setActionInProgress(true);
    setBall(ball => ({ ...ball, x: forwardPosition.x, y: forwardPosition.y, possessedBy: forwardPosition.id }));
    setPlayer(player => ({ ...player, hasBall: false }));
    setActionInProgress(false);
    if (type === 'charizard') {
      setWaitingForBall(true); // Only set waiting for Pikachu (the forward)
    }
  }, [forwardPosition.x, forwardPosition.y, forwardPosition.id, setBall, type]);

  const shootBall = useCallback(() => {
    setActionInProgress(true);
    let newBallX = ball.x;
    newBallX -= 11; // Move 10 tiles to the left

    setBall(ball => ({ ...ball, x: Math.max(0, Math.min(FIELD_WIDTH - 1, newBallX)), y: ball.y, possessedBy: null }));
    setPlayer(player => ({ ...player, hasBall: false }));
    setActionInProgress(false);

    // Call checkGoal here after shooting the ball
    checkGoal(newBallX, ball.y);
  }, [ball.x, setBall, checkGoal]);

  const handleKeyDown = useCallback((e) => {
    if (waitingForBall && type === 'pikachu') return;

    let newX = player.x;
    let newY = player.y;
    let newDirection = player.direction;

    switch (e.key) {
      case 'ArrowUp':
        newY = Math.max(0, player.y - 1);
        newDirection = 3;
        break;
      case 'ArrowDown':
        newY = Math.min(FIELD_HEIGHT - 1, player.y + 1);
        newDirection = 0;
        break;
      case 'ArrowLeft':
        if (type === 'pikachu') {
          newX = Math.max(0, player.x - 1); // Pikachu should stay on the left side
        } else if (player.x > 11) {
          newX = Math.max(11, player.x - 1); // Charizard should stay on the right side
        }
        newDirection = 1;
        break;
      case 'ArrowRight':
        if (type === 'charizard') {
          newX = Math.min(FIELD_WIDTH - 1, player.x + 1); // Charizard should stay on the right side
        } else if (player.x < 11) {
          newX = Math.min(11, player.x + 1); // Pikachu should stay on the left side
        }
        newDirection = 2;
        break;
      default:
        return;
    }

    if (!isWalkable(newX, newY)) return;

    setPlayer({ ...player, x: newX, y: newY, direction: newDirection });
    setAIPlayerPosition(id, newX, newY, newDirection);

    if (ball.possessedBy === player.id) {
      setBallPositionInFrontOfPlayer(newX, newY, newDirection);
    } else {
      checkCollision(newX, newY);
    }
  }, [player, ball.possessedBy, id, setAIPlayerPosition, setBallPositionInFrontOfPlayer, checkCollision, waitingForBall, type]);

  const moveRandomly = useCallback(() => {
    const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    handleKeyDown({ key: direction });
  }, [handleKeyDown]);

  const moveLeftThenPass = useCallback(() => {
    setActionInProgress(true);
    setBall(ball => ({ ...ball, x: forwardPosition.x, y: forwardPosition.y, possessedBy: forwardPosition.id }));
    setPlayer(player => ({ ...player, hasBall: false }));
    setActionInProgress(false);

    if (type === 'pikachu') {
      setTimeout(() => {
        setBall(ball => ({ ...ball, possessedBy: 4 }));
        shootBall();
      }, 50); // Delay shooting for 1 second after receiving the pass
    } else {
      setWaitingForBall(true); // Only set waiting for Pikachu (the forward)
    }
  }, [forwardPosition.x, forwardPosition.y, forwardPosition.id, setBall, setPlayer, type, player.id, shootBall]);

  const moveForwardAndShoot = useCallback(() => {
    setActionInProgress(true);
    let steps = 1; // Single step for Pikachu
    const intervalId = setInterval(() => {
      if (steps > 0) {
        handleKeyDown({ key: 'ArrowLeft' });
        steps -= 1;
      } else {
        clearInterval(intervalId);
        shootBall();
        setActionInProgress(false);
      }
    }, 50);
  }, [handleKeyDown, shootBall]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!actionInProgress) {
        if (player.hasBall) {
          if (role === 'defender') {
            moveLeftThenPass();
          } else if (role === 'forward') {
            shootBall();
          }
        } else if (!(waitingForBall && type === 'pikachu')) {
          moveRandomly();
          checkGoal(ball.x, ball.y);
        }
      }
    }, 100); // Move faster

    return () => clearInterval(intervalId);
  }, [player.hasBall, role, handleKeyDown, moveForwardAndShoot, moveLeftThenPass, actionInProgress, waitingForBall, type, moveRandomly]);

  return <Player type={type} x={player.x} y={player.y} direction={player.direction} hasBall={player.hasBall} sprite={sprite} />;
};

export default AIPlayer;

