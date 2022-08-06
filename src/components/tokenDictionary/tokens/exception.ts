import { createToken, Lexer } from 'chevrotain';
import Identifier from './Identifier';
import OneWordKw from './oneWordKw';

const DefinedException = createToken({
  name: 'DefinedException',
  pattern: Lexer.NA,
});

const AccessIntoNullKw = createToken({
  name: 'AccessIntoNullKw',
  pattern: /access_into_null/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const CaseNotFoundKw = createToken({
  name: 'CaseNotFoundKw',
  pattern: /case_not_found/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const CollectionIsNullKw = createToken({
  name: 'CollectionIsNullKw',
  pattern: /collection_is_null/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const CursorAlreadyOpenKw = createToken({
  name: 'CursorAlreadyOpenKw',
  pattern: /cursor_already_open/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const DupValOnIndexKw = createToken({
  name: 'DupValOnIndexKw',
  pattern: /dup_val_on_index/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const InvalidCursorKw = createToken({
  name: 'InvalidCursorKw',
  pattern: /invalid_cursor/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const InvalidNumberKw = createToken({
  name: 'InvalidNumberKw',
  pattern: /invalid_number/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const LoginDeniedKw = createToken({
  name: 'LoginDeniedKw',
  pattern: /login_denied/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const NoDataFoundKw = createToken({
  name: 'NoDataFoundKw',
  pattern: /no_data_found/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const NotLoggedOnKw = createToken({
  name: 'NotLoggedOnKw',
  pattern: /not_logged_on/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const ProgramErrorKw = createToken({
  name: 'ProgramErrorKw',
  pattern: /program_error/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const RowtypeMismatchKw = createToken({
  name: 'RowtypeMismatchKw',
  pattern: /rowtype_mismatch/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const SelfIsNullKw = createToken({
  name: 'SelfIsNullKw',
  pattern: /self_is_null/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const StorageErrorKw = createToken({
  name: 'StorageErrorKw',
  pattern: /storage_error/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const SubscriptBeyondCountKw = createToken({
  name: 'SubscriptBeyondCountKw',
  pattern: /subscript_beyond_count/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const SubscriptOutsideLimitKw = createToken({
  name: 'SubscriptOutsideLimitKw',
  pattern: /subscript_outside_limit/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const SysInvalidRowidKw = createToken({
  name: 'SysInvalidRowidKw',
  pattern: /sys_invalid_rowid/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const TimeoutOnResourceKw = createToken({
  name: 'TimeoutOnResourceKw',
  pattern: /timeout_on_resource/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const TooManyRowsKw = createToken({
  name: 'TooManyRowsKw',
  pattern: /too_many_rows/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const ValueErrorKw = createToken({
  name: 'ValueErrorKw',
  pattern: /value_error/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const ZeroDevideKw = createToken({
  name: 'ZeroDevideKw',
  pattern: /zero_divide/i,
  longer_alt: Identifier,
  categories: [DefinedException, OneWordKw],
});

const HttpEndOfBodyKw = createToken({
  name: 'HttpEndOfBodyKw',
  pattern: /utl_http\.end_of_body/i,
  longer_alt: Identifier,
  categories: [DefinedException],
});

const OthersKw = createToken({
  name: 'OthersKw',
  pattern: /others/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const ExceptionKw = createToken({
  name: 'ExceptionKw',
  pattern: /exception/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const WhenKw = createToken({
  name: 'WhenKw',
  pattern: /when/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const RaiseKw = createToken({
  name: 'RaiseKw',
  pattern: /raise/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

export default [
  DefinedException,
  AccessIntoNullKw,
  CaseNotFoundKw,
  CollectionIsNullKw,
  CursorAlreadyOpenKw,
  DupValOnIndexKw,
  InvalidCursorKw,
  InvalidNumberKw,
  LoginDeniedKw,
  NoDataFoundKw,
  NotLoggedOnKw,
  ProgramErrorKw,
  RowtypeMismatchKw,
  SelfIsNullKw,
  StorageErrorKw,
  SubscriptBeyondCountKw,
  SubscriptOutsideLimitKw,
  SysInvalidRowidKw,
  TimeoutOnResourceKw,
  TooManyRowsKw,
  ValueErrorKw,
  ZeroDevideKw,
  HttpEndOfBodyKw,
  OthersKw,
  ExceptionKw,
  WhenKw,
  RaiseKw,
];
