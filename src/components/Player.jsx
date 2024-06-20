import React from 'react';
import styled, { css } from 'styled-components';
import gengar from '../assets/gengar.png';
import nidoking from '../assets/nidoking.png';
import pikachu from '../assets/pikachu.png';
import charizard from '../assets/charizard.png';
import isPropValid from '@emotion/is-prop-valid';

const Sprite = styled('div').withConfig({
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== '$sprite' && prop !== '$frame' && prop !== '$direction',
})`
  width: 64px;
  height: 64px;
  position: absolute;
  transition: left 0.3s, top 0.3s;
  ${({ $sprite, $frame, $direction }) => css`
    background-image: url(${$sprite});
    background-position: -${$frame * 64}px -${$direction * 64}px;
  `}
`;

const Player = ({ type, x, y, direction }) => {
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
    default:
      sprite = gengar;
  }

  const frame = 0;

  return <Sprite $sprite={sprite} $frame={frame} $direction={direction} style={{ left: `${x * 32 - 16}px`, top: `${y * 32 - 16}px` }} />;
};

export default Player;
