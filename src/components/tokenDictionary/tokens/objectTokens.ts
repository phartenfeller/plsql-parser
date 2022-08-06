import { createToken } from 'chevrotain';
import Identifier from './Identifier';
import OneWordKw from './oneWordKw';

const SequenceKw = createToken({
  name: 'SequenceKw',
  pattern: /sequence/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const IncrementByKw = createToken({
  name: 'IncrementByKw',
  pattern: /increment\s+by/i,
  longer_alt: Identifier,
});

const StartWithKw = createToken({
  name: 'StartWithKw',
  pattern: /start\s+with/i,
  longer_alt: Identifier,
});

const MaxvalueKw = createToken({
  name: 'MaxvalueKw',
  pattern: /maxvalue/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const NoMaxvalueKw = createToken({
  name: 'NoMaxvalueKw',
  pattern: /nomaxvalue/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const MinvalueKw = createToken({
  name: 'MinvalueKw',
  pattern: /minvalue/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const NoMinvalueKw = createToken({
  name: 'NoMinvalueKw',
  pattern: /nominvalue/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const CycleKw = createToken({
  name: 'CycleKw',
  pattern: /cycle/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const NoCycleKw = createToken({
  name: 'NoCycleKw',
  pattern: /nocycle/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const CacheKw = createToken({
  name: 'CacheKw',
  pattern: /cache/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const NoCacheKw = createToken({
  name: 'NoCacheKw',
  pattern: /nocache/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const NoOrderKw = createToken({
  name: 'NoOrderKw',
  pattern: /noorder/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

export default [
  SequenceKw,
  IncrementByKw,
  StartWithKw,
  MaxvalueKw,
  NoMaxvalueKw,
  MinvalueKw,
  NoMinvalueKw,
  CycleKw,
  NoCycleKw,
  CacheKw,
  NoCacheKw,
  NoOrderKw,
];
