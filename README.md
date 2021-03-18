# PL/SQL-Parser

![Test](https://github.com/phartenfeller/plsql-parser/workflows/Test/badge.svg)

Contributions are welcomed, I am happy with every help :)

## Concept

This will be a multi stage parser. This means, that the first level only parses the general structure. For example it spots variable declarations but doesn't check whether the defined varchar2 variable really has a valid string value to it. That will be parsed in a later step in a string value parser.

With this approach I want to improve complexity management and improve performance as the parsers have less depth in options to test for.

## Diagram

https://phartenfeller.github.io/plsql-parser/

## References

- BNF Index from university of Geneva : http://cui.unige.ch/isi/bnf/PLSQL21/BNFindex.html
- Tokenizer and Parser Framework: https://github.com/Chevrotain/chevrotain
