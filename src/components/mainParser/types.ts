import { CstNode, IRecognitionException } from 'chevrotain';

export type ParseResult = {
  errors: IRecognitionException[];
  cst: CstNode;
};
