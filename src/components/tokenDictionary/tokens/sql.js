const { createToken, Lexer } = require('chevrotain');
const Identifier = require('./Identifier');

const SelectKw = createToken({
  name: 'SelectKw',
  pattern: /select/i,
  longer_alt: Identifier,
});

const IntoKw = createToken({
  name: 'IntoKw',
  pattern: /into/i,
  longer_alt: Identifier,
});

const FromKw = createToken({
  name: 'FromKw',
  pattern: /from/i,
  longer_alt: Identifier,
});

const WhereKw = createToken({
  name: 'WhereKw',
  pattern: /where/i,
  longer_alt: Identifier,
});

const GroupByKw = createToken({
  name: 'GroupByKw',
  pattern: /group by/i,
  longer_alt: Identifier,
});

const OrderByKw = createToken({
  name: 'OrderByKw',
  pattern: /order by/i,
  longer_alt: Identifier,
});

const AndOr = createToken({
  name: 'AndOr',
  pattern: Lexer.NA,
});

const AndKw = createToken({
  name: 'AndKw',
  pattern: /and/i,
  longer_alt: Identifier,
  categories: AndOr,
});

const OrKw = createToken({
  name: 'OrKw',
  pattern: /or/i,
  longer_alt: Identifier,
  categories: AndOr,
});

const InsertKw = createToken({
  name: 'InsertKw',
  pattern: /insert/i,
  longer_alt: Identifier,
});

const ValuesKw = createToken({
  name: 'ValuesKw',
  pattern: /values/i,
  longer_alt: Identifier,
});

const DeleteKw = createToken({
  name: 'DeleteKw',
  pattern: /delete/i,
  longer_alt: Identifier,
});

const UpdateKw = createToken({
  name: 'UpdateKw',
  pattern: /update/i,
  longer_alt: Identifier,
});

const SetKw = createToken({
  name: 'SetKw',
  pattern: /set/i,
  longer_alt: Identifier,
});

module.exports = [
  SelectKw,
  IntoKw,
  FromKw,
  WhereKw,
  GroupByKw,
  OrderByKw,
  AndOr,
  AndKw,
  OrKw,
  InsertKw,
  ValuesKw,
  DeleteKw,
  UpdateKw,
  SetKw,
];
