import { CstNode } from 'chevrotain';
import { lex } from '../tokenDictionary/tokens';
import PlSqlParser from './rules';
import { ParseResult } from './types';
import logParserErrors from './util/logParserErrors';

export const parserInstance = new PlSqlParser({ recover: false });

function parse(input: string, log = false): ParseResult {
  const lexResult = lex(input);

  // ".input" is a setter which will reset the parser's internal's state.
  parserInstance.input = lexResult.tokens;

  // No semantic actions so this won't return anything yet.
  const cst: CstNode = parserInstance.global();

  if (parserInstance.errors.length > 0 && log) {
    logParserErrors(parserInstance.errors);
  }

  return { errors: parserInstance.errors, cst };
}

export default parse;
