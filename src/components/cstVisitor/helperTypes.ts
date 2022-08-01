/* eslint-disable no-unused-vars */
import { ExceptionDef, VariableDef } from './types';

export enum VarTypes {
  variable = 'variable',
  exception = 'exception',
}

export type VariableDeclarationReturn = {
  type: VarTypes;
  def: ExceptionDef | VariableDef;
};
