import { createToken } from 'chevrotain';
import Identifier from './Identifier';
import OneWordKw from './oneWordKw';

const PackageKw = createToken({
  name: 'PackageKw',
  pattern: /package/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const CreatePackageKw = createToken({
  name: 'CreatePackageKw',
  pattern: /create (or replace )?package/i,
});

const BodyKw = createToken({
  name: 'BodyKw',
  pattern: /body/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const FunctionKw = createToken({
  name: 'FunctionKw',
  pattern: /function/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const ReturnKw = createToken({
  name: 'ReturnKw',
  pattern: /return/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const ResultCacheKw = createToken({
  name: 'ResultCacheKw',
  pattern: /result_cache/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const DeterministicKw = createToken({
  name: 'DeterministicKw',
  pattern: /deterministic/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const PipelinedKw = createToken({
  name: 'PipelinedKw',
  pattern: /pipelined/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const PipeRowKw = createToken({
  name: 'PipeRowKw',
  pattern: /pipe row/i,
});

const ProcedureKw = createToken({
  name: 'ProcedureKw',
  pattern: /procedure/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const InKw = createToken({
  name: 'InKw',
  pattern: /in/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const OutKw = createToken({
  name: 'OutKw',
  pattern: /out/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const NocopyKw = createToken({
  name: 'NocopyKw',
  pattern: /nocopy/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const DefaultKw = createToken({
  name: 'DefaultKw',
  pattern: /default/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const AuthidKw = createToken({
  name: 'AuthidKw',
  pattern: /authid/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const DefinerKw = createToken({
  name: 'DefinerKw',
  pattern: /definer/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const CurrentUserKw = createToken({
  name: 'CurrentUserKw',
  pattern: /current_user/i,
  longer_alt: Identifier,
  categories: OneWordKw,
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
