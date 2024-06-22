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
      setBall(ball => {
        console.log(`Player ${player.id} gained possession`);
        return { ...ball, possessedBy: player.id };
      });
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
    setTimeout(() => {
    setActionInProgress(true);
    let newBallX = ball.x;
    newBallX -= 10;
  
    setBall(ball => {
      console.log(`Player ${player.id} lost possession`);
      return { ...ball, x: Math.max(0, Math.min(FIELD_WIDTH - 1, newBallX)), y: ball.y, possessedBy: null };
    });
    setPlayer(player => ({ ...player, hasBall: false }));
    setActionInProgress(false);
  
   
  
    // Set a timeout to make waiting false after a delay

      setWaitingForBall(false);
  
  }, 200); // 500ms delay
  }, [ball.x, ball.y, player.type, player.x, player.y, setBall, checkGoal]);

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
  
  const setBallWithDelay = (newBallState, delay = 500) => {
    setBall(prevBall => {
      const updatedBall = { ...prevBall, ...newBallState };
      setTimeout(() => {
        setBall(prevBall => ({ ...prevBall, possessedBy: newBallState.possessedBy }));
      }, delay);
      return updatedBall;
    });
  };
  const movePikachuToBall = useCallback(() => {
   
    setTimeout(() => {
    let newX = forwardPosition.x;
    let newY = forwardPosition.y;
  
    if (ball.x > forwardPosition.x) {
      newX = forwardPosition.x + 1;
    } else if (ball.x < forwardPosition.x) {
      newX = forwardPosition.x - 1;
    }
  
    if (ball.y > forwardPosition.y) {
      newY = forwardPosition.y + 1;
    } else if (ball.y < forwardPosition.y) {
      newY = forwardPosition.y - 1;
    }
  
    // Check if the new position is walkable
    if (isWalkable(newX, newY)) {
      setPlayer(prevPlayer => ({
        ...prevPlayer,
        x: newX,
        y: newY,
      }));
  
      if (ball.possessedBy !== player.id) {
        checkCollision(newX, newY);
      }
      
    }
  }, 700);// 500ms delay 
  }, [player.x, player.y, ball.x, ball.y, player.type, setPlayer, checkCollision]);
  
  const moveLeftThenPass = useCallback(() => {
    setActionInProgress(true);
 
    setTimeout(() => {
    setBall(ball => ({
      ...ball,
      x: forwardPosition.x-1,
      y: forwardPosition.y-1,
      possessedBy: null
    }));
    setPlayer(player => ({ ...player, hasBall: false }));
    setActionInProgress(false);
             if (player.id === 4 ){

            
              movePikachuToBall();
      
            ;}
  }, 500); // 500ms delay

  
   
  }, [forwardPosition.x, forwardPosition.y, forwardPosition.id, setBall, setPlayer]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!actionInProgress) {
        switch (ball.possessedBy) {
          case 1:
          case 2:
            moveRandomly();
         
          case null:
            checkGoal(ball.x, ball.y);

            
         
            moveRandomly();
            
            break;
          case 3:
            moveLeftThenPass();
            checkGoal(ball.x, ball.y);
            break;
      
            case 4:

                shootBall();
            
              break;
            break;
          default:
            break;
        }
      }
    }, 100); // Move faster
  
    return () => clearInterval(intervalId);
  }, [
    ball.possessedBy,
    actionInProgress,
    moveRandomly,
    checkGoal,
    moveLeftThenPass,
    shootBall,
    player,
    initialX,
    initialY
  ]);

  return <Player type={type} x={player.x} y={player.y} direction={player.direction} hasBall={player.hasBall} sprite={sprite} />;
};

export default AIPlayer;

