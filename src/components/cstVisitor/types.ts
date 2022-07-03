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

export type VariableDef = {
  type: string;
  position: NodePosition;
  name: string;
  constant: boolean;
  value: string | number | undefined;
};

export type PackageContent = {
  variables?: VariableDef[];
  objects?: any[];
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
