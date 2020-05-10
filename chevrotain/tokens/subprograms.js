const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const PackageKw = createToken({
  name: 'PackageKw',
  pattern: /package/,
  longer_alt: Identifier
});

const CreatePackageKw = createToken({
  name: 'CreatePackageKw',
  pattern: /create (or replace )?package/
});

const BodyKw = createToken({
  name: 'BodyKw',
  pattern: /body/,
  longer_alt: Identifier
});

const FunctionKw = createToken({
  name: 'FunctionKw',
  pattern: /function/,
  longer_alt: Identifier
});

const ReturnKw = createToken({
  name: 'ReturnKw',
  pattern: /return/,
  longer_alt: Identifier
});

const ResultCacheKw = createToken({
  name: 'ResultCacheKw',
  pattern: /result_cache/,
  longer_alt: Identifier
});

const DeterministicKw = createToken({
  name: 'DeterministicKw',
  pattern: /deterministic/,
  longer_alt: Identifier
});

const ProcedureKw = createToken({
  name: 'ProcedureKw',
  pattern: /procedure/,
  longer_alt: Identifier
});

const InKw = createToken({
  name: 'InKw',
  pattern: /in/,
  longer_alt: Identifier
});

const OutKw = createToken({
  name: 'OutKw',
  pattern: /out/,
  longer_alt: Identifier
});

const NocopyKw = createToken({
  name: 'NocopyKw',
  pattern: /nocopy/,
  longer_alt: Identifier
});

const DefaultKw = createToken({
  name: 'DefaultKw',
  pattern: /default/,
  longer_alt: Identifier
});

module.exports = [
  PackageKw,
  CreatePackageKw,
  BodyKw,
  FunctionKw,
  ReturnKw,
  ResultCacheKw,
  DeterministicKw,
  ProcedureKw,
  InKw,
  OutKw,
  NocopyKw,
  DefaultKw
];
