import React, { useState } from 'react';
import GameField from './GameField';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
  background: #f0f0f0;
  min-height: 95vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 3em;
  margin: 20px 0;
  color: #333;
`;

const Scoreboard = styled.div`
  margin: 20px 0;
  font-size: 1.5em;
  display: flex;
  justify-content: center;
  gap: 50px;
`;

const Score = styled.p`
  margin: 0;
  color: #666;
`;

const Instructions = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
  font-size: 1.2em;
  color: #555;
`;

const Instruction = styled.li`
  margin: 5px 0;
`;

const Site = () => {
  const [score, setScore] = useState({ team1: 0, team2: 0 });

  return (
    <Container>
      <Title>PokeFootball</Title>
      <Scoreboard>
        <Score>Team 1: {Math.ceil(score.team2)}</Score>
        <Score>Team 2: {Math.ceil(score.team1)}</Score>
      </Scoreboard>
      <GameField setScore={setScore} />
      <Instructions>
        <Instruction>"a" change player</Instruction>
        <Instruction>"s" shoot</Instruction>
        <Instruction>"w" pass</Instruction>
        <Instruction>"q" cross shoot</Instruction>
      </Instructions>
    </Container>
  );
};

export default Site;

