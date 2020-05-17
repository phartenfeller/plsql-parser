const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const DtypeNumber = createToken({
  name: 'DtypeNumber',
  pattern: /number/,
  longer_alt: Identifier,
});

const DtypePlsIteger = createToken({
  name: 'DtypePlsIteger',
  pattern: /pls_integer/,
  longer_alt: Identifier,
});

const DtypeVarchar2 = createToken({
  name: 'DtypeVarchar2',
  pattern: /varchar2/,
  longer_alt: Identifier,
});

const DtypeBoolean = createToken({
  name: 'DtypeBoolean',
  pattern: /boolean/,
  longer_alt: Identifier,
});

const DtypeDate = createToken({
  name: 'DtypeDate',
  pattern: /date/,
  longer_alt: Identifier,
});

const DtypeTimestampWTZ = createToken({
  name: 'DtypeTimestampWTZ',
  pattern: /timestamp with time zone/,
  longer_alt: Identifier,
});

const DtypeTimestamp = createToken({
  name: 'DtypeTimestamp',
  pattern: /timestamp/,
  longer_alt: DtypeTimestampWTZ,
});

const Char = createToken({
  name: 'Char',
  pattern: /char/,
  longer_alt: Identifier,
});

const DateValue = createToken({
  name: 'DateValue',
  pattern: /(sysdate|current_date)/,
  longer_alt: Identifier,
});

const TsValue = createToken({
  name: 'TsValue',
  pattern: /(systimestamp|current_timestamp)/,
  longer_alt: Identifier,
});

const Rowtype = createToken({
  name: 'Rowtype',
  pattern: /rowtype/,
  longer_alt: Identifier,
});

const Type = createToken({
  name: 'Type',
  pattern: /type/,
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
  Rowtype,
  Type,
];
