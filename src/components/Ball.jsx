import React from 'react';
import styled from 'styled-components';
import ball from '../assets/ball.png';

const Sprite = styled.div`
  width: 32px;
  height: 32px;
  background-image: url(${ball});
  background-position: ${props => `-${props.frame * 32}px -${props.direction * 32}px`};
  position: absolute;
  left: ${props => props.x * 32}px;
  top: ${props => props.y * 32}px;
  transition: left 0.3s, top 0.3s;
`;

const Ball = ({ x, y, direction }) => {
  const frame = 0;

  return <Sprite frame={frame} direction={direction} x={x} y={y} />;
};

export default Ball;



