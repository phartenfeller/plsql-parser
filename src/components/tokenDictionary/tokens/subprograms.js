const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const PackageKw = createToken({
  name: 'PackageKw',
  pattern: /package/i,
  longer_alt: Identifier,
});

const CreatePackageKw = createToken({
  name: 'CreatePackageKw',
  pattern: /create (or replace )?package/i,
});

const BodyKw = createToken({
  name: 'BodyKw',
  pattern: /body/i,
  longer_alt: Identifier,
});

const FunctionKw = createToken({
  name: 'FunctionKw',
  pattern: /function/i,
  longer_alt: Identifier,
});

const ReturnKw = createToken({
  name: 'ReturnKw',
  pattern: /return/i,
  longer_alt: Identifier,
});

const ResultCacheKw = createToken({
  name: 'ResultCacheKw',
  pattern: /result_cache/i,
  longer_alt: Identifier,
});

const DeterministicKw = createToken({
  name: 'DeterministicKw',
  pattern: /deterministic/i,
  longer_alt: Identifier,
});

const ProcedureKw = createToken({
  name: 'ProcedureKw',
  pattern: /procedure/i,
  longer_alt: Identifier,
});

const InKw = createToken({
  name: 'InKw',
  pattern: /in/i,
  longer_alt: Identifier,
});

const OutKw = createToken({
  name: 'OutKw',
  pattern: /out/i,
  longer_alt: Identifier,
});

const NocopyKw = createToken({
  name: 'NocopyKw',
  pattern: /nocopy/i,
  longer_alt: Identifier,
});

const DefaultKw = createToken({
  name: 'DefaultKw',
  pattern: /default/i,
  longer_alt: Identifier,
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
  DefaultKw,
];
