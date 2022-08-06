import { createToken } from 'chevrotain';
import Identifier from './Identifier';

const LoopKw = createToken({
  name: 'LoopKw',
  pattern: /loop/i,
  longer_alt: Identifier,
});

const DoubleDot = createToken({
  name: 'DoubleDot',
  pattern: /\.\./,
  longer_alt: Identifier,
});

const WhileKw = createToken({
  name: 'WhileKw',
  pattern: /while/i,
  longer_alt: Identifier,
});

const GotoKw = createToken({
  name: 'GotoKw',
  pattern: /goto/i,
  longer_alt: Identifier,
});

export default [LoopKw, DoubleDot, WhileKw, GotoKw];
