import { createToken } from 'chevrotain';
import Identifier from './Identifier';

const SequenceKw = createToken({
  name: 'SequenceKw',
  pattern: /sequence/i,
  longer_alt: Identifier,
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
});

const NoMaxvalueKw = createToken({
  name: 'NoMaxvalueKw',
  pattern: /nomaxvalue/i,
  longer_alt: Identifier,
});

const MinvalueKw = createToken({
  name: 'MinvalueKw',
  pattern: /minvalue/i,
  longer_alt: Identifier,
});

const NoMinvalueKw = createToken({
  name: 'NoMinvalueKw',
  pattern: /nominvalue/i,
  longer_alt: Identifier,
});

const CycleKw = createToken({
  name: 'CycleKw',
  pattern: /cycle/i,
  longer_alt: Identifier,
});

const NoCycleKw = createToken({
  name: 'NoCycleKw',
  pattern: /nocycle/i,
  longer_alt: Identifier,
});

const CacheKw = createToken({
  name: 'CacheKw',
  pattern: /cache/i,
  longer_alt: Identifier,
});

const NoCacheKw = createToken({
  name: 'NoCacheKw',
  pattern: /nocache/i,
  longer_alt: Identifier,
});

const NoOrderKw = createToken({
  name: 'NoOrderKw',
  pattern: /noorder/i,
  longer_alt: Identifier,
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
