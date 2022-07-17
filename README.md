# PL/SQL-Parser

![Test](https://github.com/phartenfeller/plsql-parser/workflows/Test/badge.svg)

**This parser is a work in progress. Valid code may be marked as invalid.**

My current goal is to make the lexing and parsing work for most projects. Better error messages are for now a problem of the future.

You are welcome to contribute, I am happy with every help :)
## About

Lexer, parser and interpreter for Oracle PL/SQL.

This parser is build for basic code introspection and coding assistance. This means that it won't act 1:1 the same as the DB internal parser. For example parsing values is way more forgiving resulting in no errors from this parser where the DB parser would.

The interpreter gives an object with insights about the code. For example which packages are included, their functions / procedures + their parameters. All with position info. I am using this to build a VS Code Plugin with a Language Server.

## Usage

```typescript
import parse, { getInterpretation } from 'oracle-plsql-parser';

const code = `begin ... end;`;

// 2nd parameters logs errors to console
const {errors, cst} = parse(text, true);

// interpreter returns object with infos about the code
const interpreted = plSqlInterpreter.visit(cst);
console.log(interpreted);
```

## Installation

```sh
npm i oracle-plsql-parser@latest
```

## Diagram

**Currently broken and not updated**

https://phartenfeller.github.io/plsql-parser/

## References

- BNF Index from university of Geneva : http://cui.unige.ch/isi/bnf/PLSQL21/BNFindex.html
- Tokenizer and Parser Framework: https://github.com/Chevrotain/chevrotain
