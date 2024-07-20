import React, { useState, useEffect, useCallback } from 'react';
import Player from './Player';
import gengar from '../assets/gengar.png';
import nidoking from '../assets/nidoking.png';
import pikachu from '../assets/pikachu.png';
import charizard from '../assets/charizard.png';
import arcanine from '../assets/arcanine.png';
import blastoise from '../assets/blastoise.png';
import bulbasaur from '../assets/bulbasaur.png';
import vileplume from '../assets/vileplume.png';
import psyduck from '../assets/psyduck.png';
import jolteon from '../assets/jolteon.png';
import exeggutor from '../assets/exeggutor.png';
import wartortle from '../assets/wartortle.png';
import slowbro from '../assets/slowbro.png';
import aerodactyl from '../assets/aerodactyl.png';
import alakazam from '../assets/alakazam.png';
import butterfree from '../assets/butterfree.png';
import dragonite from '../assets/dragonite.png';
import golem from '../assets/golem.png';
import onix from '../assets/onix.png';
import houndoom from '../assets/houndoom.png';
import jynx from '../assets/jynx.png';
import lapras from '../assets/lapras.png';
import machamp from '../assets/machamp.png';
import marowak from '../assets/marowak.png';
import sandslash from '../assets/sandslash.png';
import mrmime from '../assets/mrmime.png';
import primeape from '../assets/primeape.png';
import scyther from '../assets/scyther.png';
import snorlax from '../assets/snorlax.png';
import tauros from '../assets/tauros.png';
import tyranitar from '../assets/tyranitar.png';
import venusaur from '../assets/venusaur.png';
import dodrio from '../assets/dodrio.png';
import dragonair from '../assets/dragonair.png';
import gyrados from '../assets/gyrados.png';

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
    case 'wartortle': return wartortle;
    case 'jolteon': return jolteon;
    case 'slowbro': return slowbro;
    case 'exeggutor': return exeggutor;
    case 'aerodactyl': return aerodactyl;
    case 'alakazam': return alakazam;
    case 'butterfree': return butterfree;
    case 'dragonite': return dragonite;
    case 'golem': return golem;
    case 'onix': return onix;
    case 'houndoom': return houndoom;
    case 'jynx': return jynx;
    case 'lapras': return lapras;
    case 'machamp': return machamp;
    case 'marowak': return marowak;
    case 'sandslash': return sandslash;
    case 'mrmime': return mrmime;
    case 'primeape': return primeape;
    case 'scyther': return scyther;
    case 'snorlax': return snorlax;
    case 'tauros': return tauros;
    case 'tyranitar': return tyranitar;
    case 'venusaur': return venusaur;
    case 'gyrados': return gyrados;
    case 'dodrio': return dodrio;
    case 'dragonair': return dragonair;
    default: return gengar; // Default to gengar if type is not recognized
  }
};

const AIPlayer = ({ id, type, initialX, initialY, role, ball, setBall, setAIPlayerPosition, walkableMap, goalScored, aiPlayers, players, updatePlayerPosition }) => {
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
  const [frameIndex, setFrameIndex] = useState(0);

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
      setFrameIndex((prevIndex) => (prevIndex + 1) % 4); // Update frame index for animation
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
    newBallY = Math.max(0, Math.min(FIELD_HEIGHT - 2, newBallY));

    setBall(ball => ({ ...ball, x: newBallX, y: newBallY, direction, lastShot: false }));
  }, [setBall]);

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
        } else if (ball.x === player.x && ball.y === player.y) {
          // Ball and player are at the same position
          setBall(ball => ({ ...ball, possessedBy: player.id }));
          setPlayer(prevPlayer => ({ ...prevPlayer, hasBall: true }));
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
      setFrameIndex((prevIndex) => (prevIndex + 1) % 4); // Update frame index for animation
  
      // Check collision with ball
      if (!player.hasBall && Math.abs(newX - ball.x) <= 1 && (Math.abs(newY - ball.y) <= 1 || Math.abs(newY - ball.y) <= 2) && (ball.x === newX && ball.y === newY)) {
        if (Math.random() > 0.75) { // Add randomness for possession
          setBall(ball => ({ ...ball, possessedBy: player.id }));
          setPlayer(prevPlayer => ({ ...prevPlayer, hasBall: true }));
        } else {
          setPlayer(prevPlayer => ({ ...prevPlayer, hasBall: false }));
        }
      }
  
      // Update ball position if player has possession
      if (player.hasBall) {
        setBallPositionInFrontOfPlayer(newX, newY, newDirection);
        var targetX; 
        var targetY;
        var randomDistance = Math.floor(Math.random() * 6) + 5; // Random number between 5 and 10
  
        // Check if forward is in shooting range
        if (newX <= 7) {
       
          // Function to check if a player is blocking the ball's path
          const isBlockedByPlayer = (x, y) => {
            return players && players.some(p => (p.id === 1 || p.id === 2) && p.x === x && p.y === y);
          };
          targetX = Math.max(newX - randomDistance, 0);
          targetY = newY;
          if (newX === 0) {
            
            targetX = Math.max(randomDistance-4, 0);
            targetY = 7;
          } else if (newX === 1) {
            targetX = Math.max(newX - randomDistance, 0);
            if (targetY < 7) {
            targetY = newY+1;}else{
              targetY = newY-1;
            }
          } else if (newY <= 2) {
            // Shoot diagonally downwards
            targetX = Math.max(newX - randomDistance, 0);
            targetY = Math.min(newY + randomDistance, FIELD_HEIGHT - 1);
          } else if (newY >= FIELD_HEIGHT - 3) {
            // Shoot diagonally upwards
            targetX = Math.max(newX - randomDistance, 0);
            targetY = Math.max(newY - randomDistance, 0);
          }
  
          // Check if the ball's path is blocked by player 1 or 2
          for (let x = newX; x >= targetX; x--) {
            if (isBlockedByPlayer(x, targetY)) {
              targetX = x;
              break;
            }
          }
  
          setBall(ball => ({ ...ball, x: targetX, y: targetY, possessedBy: null, lastShot: true }));
          setPlayer(prevPlayer => ({ ...prevPlayer, hasBall: false }));
          setHasShot(true); // Set hasShot to true after shooting
          setTimeout(() => setHasShot(false), 2000); // Reset hasShot after 2 seconds
        } else {
          targetX = Math.max(newX - randomDistance, 0);
          targetY = newY;
        }
      } 
    } else {
      
      targetX = Math.max(newX - randomDistance, 0);
      targetY = newY;
      
      console.log(`Player ${player.id} is in front of non-walkable tiles at (${newX}, ${newY})`);
      const altX = player.x + 1;
      const altY = player.y;
      if (isWalkable(altX, altY)) {
        setPlayer(prevPlayer => ({ ...prevPlayer, x: altX, y: altY, direction: 2 }));
        setFrameIndex((prevIndex) => (prevIndex + 1) % 4); // Update frame index for animation
      }
    }
  }, [ball, player, players, setBall, firstNullHandled, hasShot, setPlayer, setBallPositionInFrontOfPlayer, updatePlayerPosition]);
  


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

  return <Player type={type} x={player.x} y={player.y} direction={player.direction} frameIndex={frameIndex} hasBall={player.hasBall} sprite={sprite} />;
};

export default AIPlayer;















