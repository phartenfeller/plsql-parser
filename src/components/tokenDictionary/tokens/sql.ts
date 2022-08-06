import { createToken, Lexer } from 'chevrotain';
import Identifier from './Identifier';
import OneWordKw from './oneWordKw';

const SelectKw = createToken({
  name: 'SelectKw',
  pattern: /select/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const IntoKw = createToken({
  name: 'IntoKw',
  pattern: /into/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const FromKw = createToken({
  name: 'FromKw',
  pattern: /from/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const WhereKw = createToken({
  name: 'WhereKw',
  pattern: /where/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const GroupByKw = createToken({
  name: 'GroupByKw',
  pattern: /group by/i,
  longer_alt: Identifier,
});

const OrderKw = createToken({
  name: 'OrderKw',
  pattern: /order/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const AscDescKw = createToken({
  name: 'AscDescKw',
  pattern: /asc|desc/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const NullsFirstLastKw = createToken({
  name: 'NullsFirstLastKw',
  pattern: /nulls\s+(first|last)/i,
  longer_alt: Identifier,
});

const Null = createToken({
  name: 'Null',
  pattern: /null/i,
  longer_alt: NullsFirstLastKw,
  categories: OneWordKw,
});

const AndOr = createToken({
  name: 'AndOr',
  pattern: Lexer.NA,
});

const AndKw = createToken({
  name: 'AndKw',
  pattern: /and/i,
  longer_alt: Identifier,
  categories: [AndOr, OneWordKw],
});

const OrKw = createToken({
  name: 'OrKw',
  pattern: /or/i,
  longer_alt: Identifier,
  categories: [AndOr, OneWordKw],
});

const JoinKw = createToken({
  name: 'JoinKw',
  pattern: /join/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const JoinDirection = createToken({
  name: 'JoinDirection',
  pattern: Lexer.NA,
});

const LeftKw = createToken({
  name: 'LeftKw',
  pattern: /left/i,
  longer_alt: Identifier,
  categories: [JoinDirection, OneWordKw],
});

const RightKw = createToken({
  name: 'RightKw',
  pattern: /right/i,
  longer_alt: Identifier,
  categories: [JoinDirection, OneWordKw],
});

const InnerKw = createToken({
  name: 'InnerKw',
  pattern: /inner/i,
  longer_alt: Identifier,
  categories: [JoinDirection, OneWordKw],
});

const OuterKw = createToken({
  name: 'OuterKw',
  pattern: /outer/i,
  longer_alt: Identifier,
  categories: [JoinDirection, OneWordKw],
});

const CrossKw = createToken({
  name: 'CrossKw',
  pattern: /cross/i,
  longer_alt: Identifier,
  categories: [JoinDirection, OneWordKw],
});

const InsertKw = createToken({
  name: 'InsertKw',
  pattern: /insert/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const ValuesKw = createToken({
  name: 'ValuesKw',
  pattern: /values/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const DeleteKw = createToken({
  name: 'DeleteKw',
  pattern: /delete/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const UpdateKw = createToken({
  name: 'UpdateKw',
  pattern: /update/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const SetKw = createToken({
  name: 'SetKw',
  pattern: /set/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const HavingKw = createToken({
  name: 'HavingKw',
  pattern: /having/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const ForallKw = createToken({
  name: 'ForallKw',
  pattern: /forall/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const OverKw = createToken({
  name: 'OverKw',
  pattern: /over/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const PartitionByKw = createToken({
  name: 'PartitionByKw',
  pattern: /partition\s+by/i,
  longer_alt: Identifier,
});

const WithinGroupKw = createToken({
  name: 'WithinGroupKw',
  pattern: /within\s+group/i,
  longer_alt: Identifier,
});

// dont want single tokens for first / last as they are also function names
const FetchFirstLastKw = createToken({
  name: 'FetchFirstLastKw',
  pattern: /fetch\s+(first|last|next)/i,
  longer_alt: Identifier,
});

const FetchKw = createToken({
  name: 'FetchKw',
  pattern: /fetch/i,
  longer_alt: [FetchFirstLastKw, Identifier],
  categories: OneWordKw,
});

const PercentKw = createToken({
  name: 'PercentKw',
  pattern: /percent/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const OnlyKw = createToken({
  name: 'OnlyKw',
  pattern: /only/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const WithTiesKw = createToken({
  name: 'WithTiesKw',
  pattern: /with\s+ties/i,
  longer_alt: Identifier,
});

const WithKw = createToken({
  name: 'WithKw',
  pattern: /with/i,
  longer_alt: [WithinGroupKw, WithTiesKw, Identifier],
  categories: OneWordKw,
});

const OnKw = createToken({
  name: 'OnKw',
  pattern: /on/i,
  longer_alt: [Identifier, OnlyKw],
  categories: OneWordKw,
});

const JsonTableKw = createToken({
  name: 'JsonTableKw',
  pattern: /json_table/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const ColumnsKw = createToken({
  name: 'ColumnsKw',
  pattern: /columns/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const PathKw = createToken({
  name: 'PathKw',
  pattern: /path/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const FormatJsonKw = createToken({
  name: 'FormatJsonKw',
  pattern: /format\s+json/i,
  longer_alt: Identifier,
});

export default [
  SelectKw,
  IntoKw,
  FromKw,
  WhereKw,
  GroupByKw,
  OrderKw,
  AscDescKw,
  NullsFirstLastKw,
  Null,
  AndOr,
  AndKw,
  OrKw,
  JoinKw,
  JoinDirection,
  LeftKw,
  RightKw,
  InnerKw,
  OuterKw,
  CrossKw,
  InsertKw,
  ValuesKw,
  DeleteKw,
  UpdateKw,
  SetKw,
  HavingKw,
  ForallKw,
  OverKw,
  PartitionByKw,
  WithinGroupKw,
  FetchFirstLastKw,
  FetchKw,
  PercentKw,
  OnlyKw,
  WithTiesKw,
  WithKw,
  OnKw,
  JsonTableKw,
  ColumnsKw,
  PathKw,
  FormatJsonKw,
];
