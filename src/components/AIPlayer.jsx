import React, { useState, useEffect, useCallback } from 'react';
import Player from './Player';
import pikachu from '../assets/pikachu.png';
import charizard from '../assets/charizard.png';
import blastoise from '../assets/blastoise.png';
import arcanine from '../assets/arcanine.png';
import bulbasaur from '../assets/bulbasaur.png';
import vileplume from '../assets/vileplume.png';
import gengar from '../assets/gengar.png';
import nidoking from '../assets/nidoking.png';
import psyduck from '../assets/psyduck.png';
import jolteon from '../assets/jolteon.png';

const FIELD_WIDTH = 22;
const FIELD_HEIGHT = 15;

const getSprite = (type) => {
  switch (type) {
    case 'pikachu': return pikachu;
    case 'charizard': return charizard;
    case 'blastoise': return blastoise;
    case 'arcanine': return arcanine;
    case 'bulbasaur': return bulbasaur;
    case 'vileplume': return vileplume;
    case 'gengar': return gengar;
    case 'nidoking': return nidoking;
    case 'psyduck': return psyduck;
    case 'jolteon': return jolteon;
    default: return gengar; // Default to gengar if type is not recognized
  }
};

const AIPlayer = ({ id, type, initialX, initialY, role, ball, setBall, setAIPlayerPosition, walkableMap, goalScored, aiPlayers }) => {
  const sprite = getSprite(type);

  const [player, setPlayer] = useState({
    id,
    x: initialX,
    y: initialY,
    direction: 0,
    hasBall: false,
    role
  });

  const [firstNullHandled, setFirstNullHandled] = useState(false);
  const [hasShot, setHasShot] = useState(false);

  const isWalkable = (x, y) => {
    return y >= 0 && y < FIELD_HEIGHT && x >= 0 && x < FIELD_WIDTH && walkableMap[y] && walkableMap[y][x] === 1;
  };

  const isGoalkeeperBlocking = (newBallX, newBallY) => {
    const goalkeeper = aiPlayers.find(player => player.role === 'goalkeeper');
    return newBallY === goalkeeper.y && newBallX >= 20;
  };

  const moveGoalkeeper = useCallback(() => {
    let newX = player.x;
    let newY = player.y;

    // Move along the Y-axis within the goal area
    if (ball.y > newY) {
      newY++;
    } else if (ball.y < newY) {
      newY--;
    }

    // Ensure the goalkeeper stays within the goal area
    newX = FIELD_WIDTH - 2;

    if (isWalkable(newX, newY)) {
      setPlayer(prevPlayer => ({ ...prevPlayer, x: newX, y: newY }));
    }

    // Check collision with ball
    if (
      Math.abs(newX - ball.x) <= 1 &&
      (Math.abs(newY - ball.y) <= 1 || Math.abs(newY - ball.y) === 1)
    ) {
      setBall(ball => ({ ...ball, possessedBy: player.id }));
      setPlayer(prevPlayer => ({ ...prevPlayer, hasBall: true }));
    }

    if (player.hasBall) {
      // Shoot the ball diagonally if near top or bottom
      if (newY <= 2) {
        // Shoot diagonally downwards
        setBall(ball => ({ ...ball, x: Math.max(newX - 9, 0), y: Math.min(newY + 9, FIELD_HEIGHT - 1), possessedBy: null }));
      } else if (newY >= FIELD_HEIGHT - 3) {
        // Shoot diagonally upwards
        setBall(ball => ({ ...ball, x: Math.max(newX - 9, 0), y: Math.max(newY - 9, 0), possessedBy: null }));
      } else {
        // Pass the ball to the forward or shoot
        const forwardPosition = { x: 5, y: player.y }; // Example forward position
        if (Math.random() > 0.5) {
          // Pass to forward
          setBall(ball => ({ ...ball, x: forwardPosition.x, y: forwardPosition.y, possessedBy: null }));
        } else {
          // Shoot the ball
          setBall(ball => ({ ...ball, x: player.x - 9, y: player.y, possessedBy: null }));
        }
      }
      setPlayer(prevPlayer => ({ ...prevPlayer, hasBall: false }));
    }
  }, [ball, player, setBall]);

  const moveForward = useCallback(() => {
    let newX = player.x;
    let newY = player.y;
    let newDirection = player.direction;

    if (player.hasBall) {
      // Move towards the goal (left direction)
      if (newX > 0) {
        newX--;
        newDirection = 1; // Left
      }
    } else {
      if (ball.possessedBy === null && ball.x === Math.floor(FIELD_WIDTH / 2) && ball.y === Math.floor(FIELD_HEIGHT / 2)) {
        if (!firstNullHandled) {
          // Stay in place if it's the first time the ball is null and in the middle
          setFirstNullHandled(true);
          return;
        }
      } else if (ball.possessedBy === null) {
        // Move towards the ball if it's null (after the first null)
        if (hasShot) return; // Prevent moving if the player has just shot
        if (ball.x > player.x) {
          newX++;
          newDirection = 2; // Right
        } else if (ball.x < player.x) {
          newX--;
          newDirection = 1; // Left
        }
        if (ball.y > player.y) {
          newY++;
          newDirection = 0; // Down
        } else if (ball.y < player.y) {
          newY--;
          newDirection = 3; // Up
        }
      } else {
        setFirstNullHandled(false);
        setHasShot(false); // Reset hasShot when ball is possessed by player 1 or 2
        if (ball.possessedBy !== null && ball.possessedBy < 3) {
          // Move towards the ball if possessed by player 1 or 2
          if (ball.x > player.x) {
            newX++;
            newDirection = 2; // Right
          } else if (ball.x < player.x) {
            newX--;
            newDirection = 1; // Left
          }
          if (ball.y > player.y) {
            newY++;
            newDirection = 0; // Down
          } else if (ball.y < player.y) {
            newY--;
            newDirection = 3; // Up
          }
        }
      }
    }

    if (isWalkable(newX, newY)) {
      setPlayer(prevPlayer => ({ ...prevPlayer, x: newX, y: newY, direction: newDirection }));

      // Check collision with ball
      if (!player.hasBall && Math.abs(newX - ball.x) <= 1 && Math.abs(newY - ball.y) <= 1) {
        if (Math.random() > 0.2) { // Add randomness for possession
          setBall(ball => ({ ...ball, possessedBy: player.id }));
          setPlayer(prevPlayer => ({ ...prevPlayer, hasBall: true }));
        }
      }

      // Update ball position if player has possession
      if (player.hasBall) {
        setBall(ball => ({ ...ball, x: newX, y: newY + 1 }));

        // Check if forward is in shooting range
       if (newX <= 7) {
          // Shoot the ball 9 tiles to the left
          if (newY <= 2) {
            // Shoot diagonally downwards
            setBall(ball => ({ ...ball, x: Math.max(newX - 9, 0), y: Math.min(newY + 9, FIELD_HEIGHT - 1), possessedBy: null }));
          } else if (newY >= FIELD_HEIGHT - 3) {
            // Shoot diagonally upwards
            setBall(ball => ({ ...ball, x: Math.max(newX - 9, 0), y: Math.max(newY - 9, 0), possessedBy: null }));
          } else {
            setBall(ball => ({ ...ball, x: Math.max(newX - 9, 0), y: newY, possessedBy: null }));
          }
          setPlayer(prevPlayer => ({ ...prevPlayer, hasBall: false }));
          setHasShot(true); // Set hasShot to true after shooting
          setTimeout(() => setHasShot(false), 1000); // Reset hasShot after 1 second
        }
      }
    }
  }, [ball, player, setBall, firstNullHandled, hasShot]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (goalScored) {
        // Reset to initial positions after goal is scored
        setPlayer({ id, x: initialX, y: initialY, direction: 0, hasBall: false, role });
        setFirstNullHandled(false);
        setHasShot(false); // Reset hasShot when a goal is scored
      } else {
        if (player.role === 'goalkeeper') {
          moveGoalkeeper();
        } else if (player.role === 'forward') {
          moveForward();
        }
      }
    }, 200); // Update interval for faster movement

    return () => clearInterval(intervalId);
  }, [goalScored, moveGoalkeeper, moveForward, player.role, initialX, initialY]);

  return <Player type={type} x={player.x} y={player.y} direction={player.direction} hasBall={player.hasBall} sprite={sprite} />;
};

export default AIPlayer;











