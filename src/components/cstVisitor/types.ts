/* eslint-disable no-unused-vars */
export type NodePosition = {
  startLine: number | undefined;
  startOffset: number;
  endLine: number | undefined;
  endColumn: number | undefined;
};

export type GlobalObjects = {
  packages: PackageDef[];
};

export type SimpleVariableDef = {
  type: string;
  position: NodePosition;
  name: string;
};

export type VariableDef = SimpleVariableDef & {
  constant: boolean;
  value: string | number | undefined;
};

export type ExceptionDef = {
  position: NodePosition;
  name: string;
};

export type TypeDef = {
  type: TypeClass;
  position: NodePosition;
  name: string;
  tableOf?: string;
  tableIndex?: string;
  recordFields?: SimpleVariableDef[];
};

export type PackageContent = {
  variables?: VariableDef[];
  objects?: any[];
  types?: any[];
};

export type PackageDef = {
  type: ObjectContext;
  position: NodePosition;
  name: string;
  content: PackageContent;
};

export enum ObjectType {
  fc = 'function',
  prc = 'procedure',
}

export enum ObjectContext {
  spec = 'spec',
  body = 'body',
}

export enum ArgumentDirection {
  in = 'in',
  out = 'out',
  inOut = 'in out',
}

export enum TypeClass {
  record = 'record',
  table = 'table',
}
