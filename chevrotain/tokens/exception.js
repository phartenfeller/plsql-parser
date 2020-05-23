const { createToken, Lexer } = require('chevrotain');
const Identifier = require('./Identifier');

const DefinedException = createToken({
  name: 'DefinedException',
  pattern: Lexer.NA,
});

const AccessIntoNullKw = createToken({
  name: 'AccessIntoNullKw',
  pattern: /access_into_null/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const CaseNotFoundKw = createToken({
  name: 'CaseNotFoundKw',
  pattern: /case_not_found/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const CollectionIsNullKw = createToken({
  name: 'CollectionIsNullKw',
  pattern: /collection_is_null/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const CursorAlreadyOpenKw = createToken({
  name: 'CursorAlreadyOpenKw',
  pattern: /cursor_already_open/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const DupValOnIndexKw = createToken({
  name: 'DupValOnIndexKw',
  pattern: /dup_val_on_index/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const InvalidCursorKw = createToken({
  name: 'InvalidCursorKw',
  pattern: /invalid_cursor/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const InvalidNumberKw = createToken({
  name: 'InvalidNumberKw',
  pattern: /invalid_number/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const LoginDeniedKw = createToken({
  name: 'LoginDeniedKw',
  pattern: /login_denied/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const NoDataFoundKw = createToken({
  name: 'NoDataFoundKw',
  pattern: /no_data_found/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const NotLoggedOnKw = createToken({
  name: 'NotLoggedOnKw',
  pattern: /not_logged_on/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const ProgramErrorKw = createToken({
  name: 'ProgramErrorKw',
  pattern: /program_error/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const RowtypeMismatchKw = createToken({
  name: 'RowtypeMismatchKw',
  pattern: /rowtype_mismatch/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const SelfIsNullKw = createToken({
  name: 'SelfIsNullKw',
  pattern: /self_is_null/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const StorageErrorKw = createToken({
  name: 'StorageErrorKw',
  pattern: /storage_error/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const SubscriptBeyondCountKw = createToken({
  name: 'SubscriptBeyondCountKw',
  pattern: /subscript_beyond_count/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const SubscriptOutsideLimitKw = createToken({
  name: 'SubscriptOutsideLimitKw',
  pattern: /subscript_outside_limit/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const SysInvalidRowidKw = createToken({
  name: 'SysInvalidRowidKw',
  pattern: /sys_invalid_rowid/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const TimeoutOnResourceKw = createToken({
  name: 'TimeoutOnResourceKw',
  pattern: /timeout_on_resource/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const TooManyRowsKw = createToken({
  name: 'TooManyRowsKw',
  pattern: /too_many_rows/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const ValueErrorKw = createToken({
  name: 'ValueErrorKw',
  pattern: /value_error/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const ZeroDevideKw = createToken({
  name: 'ZeroDevideKw',
  pattern: /zero_divide/,
  longer_alt: Identifier,
  categories: DefinedException,
});

const OthersKw = createToken({
  name: 'OthersKw',
  pattern: /others/,
  longer_alt: Identifier,
});

const ExceptionKw = createToken({
  name: 'ExceptionKw',
  pattern: /exception/,
  longer_alt: Identifier,
});

const WhenKw = createToken({
  name: 'WhenKw',
  pattern: /when/,
  longer_alt: Identifier,
});

module.exports = [
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
  OthersKw,
  ExceptionKw,
  WhenKw,
];
