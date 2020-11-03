const { createToken, Lexer } = require('chevrotain');
const Identifier = require('./Identifier');

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
  longer_alt: DtypeTimestampWTZ,
});

const Char = createToken({
  name: 'Char',
  pattern: /char/i,
  longer_alt: Identifier,
});

const DateValue = createToken({
  name: 'DateValue',
  pattern: /(sysdate|current_date)/i,
  longer_alt: Identifier,
});

const TsValue = createToken({
  name: 'TsValue',
  pattern: /(systimestamp|current_timestamp)/i,
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
  longer_alt: Identifier,
});

const Type = createToken({
  name: 'Type',
  pattern: /type/i,
  longer_alt: Identifier,
});

const ConstantKw = createToken({
  name: 'ConstantKw',
  pattern: /constant/i,
  longer_alt: Identifier,
});

module.exports = [
  DtypeNumber,
  DtypePlsIteger,
  DtypeVarchar2,
  DtypeBoolean,
  DtypeDate,
  DtypeTimestampWTZ,
  DtypeTimestamp,
  Char,
  DateValue,
  TsValue,
  JsonDtypes,
  JsonObjectT,
  JsonArrayT,
  JsonElementT,
  JsonScalarT,
  Rowtype,
  Type,
  ConstantKw,
];
