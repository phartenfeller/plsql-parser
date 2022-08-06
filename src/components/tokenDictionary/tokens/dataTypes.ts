import { createToken, Lexer, TokenType } from 'chevrotain';
import Identifier from './Identifier';
import exception from './exception';
import OneWordKw from './oneWordKw';

const DtypeNumber = createToken({
  name: 'DtypeNumber',
  pattern: /number/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const DtypePlsIteger = createToken({
  name: 'DtypePlsIteger',
  pattern: /pls_integer/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const DtypeVarchar2 = createToken({
  name: 'DtypeVarchar2',
  pattern: /varchar2/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const DtypeBoolean = createToken({
  name: 'DtypeBoolean',
  pattern: /boolean/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const DtypeDate = createToken({
  name: 'DtypeDate',
  pattern: /date/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const DtypeTimestampWTZ = createToken({
  name: 'DtypeTimestampWTZ',
  pattern: /timestamp with time zone/i,
  longer_alt: Identifier,
});

const DtypeTimestamp = createToken({
  name: 'DtypeTimestamp',
  pattern: /timestamp/i,
  longer_alt: [DtypeTimestampWTZ, Identifier],
  categories: [OneWordKw],
});

const DtypeRaw = createToken({
  name: 'DtypeRaw',
  pattern: /raw/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const Char = createToken({
  name: 'Char',
  pattern: /char/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const JsonDtypes = createToken({
  name: 'JsonDtypes',
  pattern: Lexer.NA,
});

const JsonObjectT = createToken({
  name: 'JsonObjectT',
  pattern: /json_object_t/i,
  longer_alt: Identifier,
  categories: [JsonDtypes, OneWordKw],
});

const JsonArrayT = createToken({
  name: 'JsonArrayT',
  pattern: /json_array_t/i,
  longer_alt: Identifier,
  categories: [JsonDtypes, OneWordKw],
});

const JsonElementT = createToken({
  name: 'JsonElementT',
  pattern: /json_element_t/i,
  longer_alt: Identifier,
  categories: [JsonDtypes, OneWordKw],
});

const JsonScalarT = createToken({
  name: 'JsonScalarT',
  pattern: /json_scalar_t/i,
  longer_alt: Identifier,
  categories: [JsonDtypes, OneWordKw],
});

const Rowtype = createToken({
  name: 'Rowtype',
  pattern: /rowtype/i,
  longer_alt: [
    exception.find((t) => t.name === 'RowtypeMismatchKw') as TokenType,
    Identifier,
  ],
  categories: [OneWordKw],
});

const Type = createToken({
  name: 'Type',
  pattern: /type/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const OffsetKw = createToken({
  name: 'OffsetKw',
  pattern: /offset/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const OfKw = createToken({
  name: 'OfKw',
  pattern: /of/i,
  longer_alt: [OffsetKw, Identifier],
  categories: [OneWordKw],
});

const MemberOfKw = createToken({
  name: 'MemberOfKw',
  pattern: /member\s+of/i,
  longer_alt: Identifier,
});

const IndexKw = createToken({
  name: 'IndexKw',
  pattern: /index/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const ByKw = createToken({
  name: 'ByKw',
  pattern: /by/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const RecordKw = createToken({
  name: 'RecordKw',
  pattern: /record/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const ConstantKw = createToken({
  name: 'ConstantKw',
  pattern: /constant/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

export default [
  DtypeNumber,
  DtypePlsIteger,
  DtypeVarchar2,
  DtypeBoolean,
  DtypeDate,
  DtypeTimestampWTZ,
  DtypeTimestamp,
  DtypeRaw,
  Char,
  JsonDtypes,
  JsonObjectT,
  JsonArrayT,
  JsonElementT,
  JsonScalarT,
  Rowtype,
  Type,
  OffsetKw,
  OfKw,
  MemberOfKw,
  IndexKw,
  ByKw,
  RecordKw,
  ConstantKw,
];
