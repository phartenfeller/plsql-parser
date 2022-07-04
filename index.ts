import { CstNode } from 'chevrotain';
import plSqlInterpreter from './src/components/cstVisitor';
import { GlobalObjects } from './src/components/cstVisitor/types';
import parse from './src/components/mainParser/recoveryParser';

function parsePlSql(code: string) {
  try {
    if (!code || typeof code !== 'string') {
      throw new Error('Code is empty or not a string');
    }
    const result = parse(code, true);
    return result;
  } catch (err) {
    throw new Error(`Parsing error occured: ${err}`);
  }
}

export function getInterpretation(cst: CstNode): GlobalObjects {
  return plSqlInterpreter.visit(cst) as GlobalObjects;
}

export default parsePlSql;
