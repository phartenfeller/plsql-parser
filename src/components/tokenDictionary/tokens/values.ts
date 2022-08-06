import { createToken, Lexer } from 'chevrotain';
import Identifier from './Identifier';
import OneWordKw from './oneWordKw';

const ValueKeyword = createToken({
  name: 'ValueKeyword',
  pattern: Lexer.NA,
});

const DateValue = createToken({
  name: 'DateValue',
  pattern: /(sysdate|current_date)/i,
  longer_alt: Identifier,
  categories: [ValueKeyword, OneWordKw],
});

const TsValue = createToken({
  name: 'TsValue',
  pattern: /(systimestamp|current_timestamp)/i,
  longer_alt: Identifier,
  categories: [ValueKeyword, OneWordKw],
});

const BoolValue = createToken({
  name: 'BoolValue',
  pattern: Lexer.NA,
  categories: [ValueKeyword, OneWordKw],
});

const BoolTrue = createToken({
  name: 'BoolTrue',
  pattern: /true/i,
  longer_alt: Identifier,
  categories: BoolValue,
});

const BoolFalse = createToken({
  name: 'BoolTrue',
  pattern: /false/i,
  longer_alt: Identifier,
  categories: BoolValue,
});

const CompilationFlag = createToken({
  name: 'CompilationFlag',
  pattern: /\$\$plsql_unit|\$\$plsql_type/i,
  categories: ValueKeyword,
});

export default [
  ValueKeyword,
  DateValue,
  TsValue,
  BoolValue,
  BoolTrue,
  BoolFalse,
  CompilationFlag,
];
