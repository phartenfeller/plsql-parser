import { createToken, Lexer, TokenType } from 'chevrotain';
import Identifier from './Identifier';
import exception from './exception';

const DtypeNumber = createToken({
  name: 'DtypeNumber',
  pattern: /number/i,
  longer_alt: Identifier,
});

const DtypePlsIteger = createToken({
  name: 'DtypePlsIteger',
  pattern: /pls_integer/i,
  longer_alt: Identifier,
});

const DtypeVarchar2 = createToken({
  name: 'DtypeVarchar2',
  pattern: /varchar2/i,
  longer_alt: Identifier,
});

const DtypeBoolean = createToken({
  name: 'DtypeBoolean',
  pattern: /boolean/i,
  longer_alt: Identifier,
});

const DtypeDate = createToken({
  name: 'DtypeDate',
  pattern: /date/i,
  longer_alt: Identifier,
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
});

const DtypeRaw = createToken({
  name: 'DtypeRaw',
  pattern: /raw/i,
  longer_alt: Identifier,
});

const Char = createToken({
  name: 'Char',
  pattern: /char/i,
  longer_alt: Identifier,
});

const JsonDtypes = createToken({
  name: 'JsonDtypes',
  pattern: Lexer.NA,
});

const JsonObjectT = createToken({
  name: 'JsonObjectT',
  pattern: /json_object_t/i,
  longer_alt: Identifier,
  categories: JsonDtypes,
});

const JsonArrayT = createToken({
  name: 'JsonArrayT',
  pattern: /json_array_t/i,
  longer_alt: Identifier,
  categories: JsonDtypes,
});

const JsonElementT = createToken({
  name: 'JsonElementT',
  pattern: /json_element_t/i,
  longer_alt: Identifier,
  categories: JsonDtypes,
});

const JsonScalarT = createToken({
  name: 'JsonScalarT',
  pattern: /json_scalar_t/i,
  longer_alt: Identifier,
  categories: JsonDtypes,
});

const Rowtype = createToken({
  name: 'Rowtype',
  pattern: /rowtype/i,
  longer_alt: [
    exception.find((t) => t.name === 'RowtypeMismatchKw') as TokenType,
    Identifier,
  ],
});

const Type = createToken({
  name: 'Type',
  pattern: /type/i,
  longer_alt: Identifier,
});

const OffsetKw = createToken({
  name: 'OffsetKw',
  pattern: /offset/i,
  longer_alt: Identifier,
});

const OfKw = createToken({
  name: 'OfKw',
  pattern: /of/i,
  longer_alt: [OffsetKw, Identifier],
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
});

const ByKw = createToken({
  name: 'ByKw',
  pattern: /by/i,
  longer_alt: Identifier,
});

const RecordKw = createToken({
  name: 'RecordKw',
  pattern: /record/i,
  longer_alt: Identifier,
});

const ConstantKw = createToken({
  name: 'ConstantKw',
  pattern: /constant/i,
  longer_alt: Identifier,
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
