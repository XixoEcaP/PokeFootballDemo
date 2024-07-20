import React from 'react';
import styled, { css } from 'styled-components';
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

const Sprite = styled.div`
  width: 64px;
  height: 64px;
  position: absolute;
  transition: left 0.3s, top 0.3s;
  ${({ $sprite, $frame, $direction }) => css`
    background-image: url(${$sprite});
    background-position: -${$frame * 64}px -${$direction * 64}px;
  `}
`;

const Player = ({ type, x, y, direction, frameIndex }) => {
  let sprite;
  switch (type) {
    case 'gengar':
      sprite = gengar;
      break;
    case 'nidoking':
      sprite = nidoking;
      break;
    case 'pikachu':
      sprite = pikachu;
      break;
    case 'charizard':
      sprite = charizard;
      break;
    case 'arcanine':
      sprite = arcanine;
      break;
    case 'blastoise':
      sprite = blastoise;
      break;
    case 'bulbasaur':
      sprite = bulbasaur;
      break;
    case 'vileplume':
      sprite = vileplume;
      break;
    case 'psyduck':
      sprite = psyduck;
      break;
    case 'slowbro':
      sprite = slowbro;
      break;
    case 'wartortle':
      sprite = wartortle;
      break;
    case 'exeggutor':
      sprite = exeggutor;
      break;
    case 'jolteon':
      sprite = jolteon;
      break;
    case 'aerodactyl':
      sprite = aerodactyl;
      break;
    case 'alakazam':
      sprite = alakazam;
      break;
    case 'butterfree':
      sprite = butterfree;
      break;
    case 'dragonite':
      sprite = dragonite;
      break;
    case 'golem':
      sprite = golem;
      break;
    case 'onix':
      sprite = onix;
      break;
    case 'houndoom':
      sprite = houndoom;
      break;
    case 'jynx':
      sprite = jynx;
      break;
    case 'lapras':
      sprite = lapras;
      break;
    case 'machamp':
      sprite = machamp;
      break;
    case 'marowak':
      sprite = marowak;
      break;
    case 'sandslash':
      sprite = sandslash;
      break;
    case 'mrmime':
      sprite = mrmime;
      break;
    case 'primeape':
      sprite = primeape;
      break;
    case 'scyther':
      sprite = scyther;
      break;
    case 'snorlax':
      sprite = snorlax;
      break;
    case 'tauros':
      sprite = tauros;
      break;
    case 'tyranitar':
      sprite = tyranitar;
      break;
    case 'venusaur':
      sprite = venusaur;
      break;
    default:
      sprite = gengar; // Default to gengar if type is not recognized
  }

  return <Sprite $sprite={sprite} $frame={frameIndex} $direction={direction} style={{ left: `${x * 32 - 16}px`, top: `${y * 32 - 16}px` }} />;
};

export default Player;




