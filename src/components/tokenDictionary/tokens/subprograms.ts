import { createToken } from 'chevrotain';
import Identifier from './Identifier';

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

const PipelinedKw = createToken({
  name: 'PipelinedKw',
  pattern: /pipelined/i,
  longer_alt: Identifier,
});

const PipeRowKw = createToken({
  name: 'PipeRowKw',
  pattern: /pipe row/i,
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

const AuthidKw = createToken({
  name: 'AuthidKw',
  pattern: /authid/i,
  longer_alt: Identifier,
});

const DefinerKw = createToken({
  name: 'DefinerKw',
  pattern: /definer/i,
  longer_alt: Identifier,
});

const CurrentUserKw = createToken({
  name: 'CurrentUserKw',
  pattern: /current_user/i,
  longer_alt: Identifier,
});

export default [
  PackageKw,
  CreatePackageKw,
  BodyKw,
  FunctionKw,
  ReturnKw,
  ResultCacheKw,
  DeterministicKw,
  PipelinedKw,
  PipeRowKw,
  ProcedureKw,
  InKw,
  OutKw,
  NocopyKw,
  DefaultKw,
  AuthidKw,
  DefinerKw,
  CurrentUserKw,
];
