/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%
\s+                   {/* skip whitespace */}
[0-9]+("."[0-9]+)?\b  {return 'NUMBER';}
"declare"             {return 'DECLARE';}
"begin"               {return 'BEGIN';}
"end"                 {return 'END';}
^[\t\n\r \xA0]+       {return 'PLAIN';}
^'[^']*'              {return 'STRING';}
^&&?[a-z_0-9#]+\.?/i  {return 'VARIABLE';}
^(:|\$\$)[a-z]\w+/i   {return 'VARIABLE';}
^[;,]                 {return 'PUNCTUATION';}
<<EOF>>               {return 'EOF';}

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS

%start expressions

%% /* language grammar */

expressions: e EOF
    { typeof console !== 'undefined' ? console.log($1) : print($1);
      return $1; 
    }
;

datatype: "binary_integer" 
        | "natural" 
        | "positive" 
        | ( "number" [ "(" n [ "," n ] ")" ] ) 
        | ( "char" [ "(" n ")" ] ) 
        | ( "varchar2" [ "(" n ")" ])
        | ( "long" ) 
        | ( "raw" ) 
        | ( "long" "raw" ) 
        | ( "boolean" ) 
        | ( "date" ) 
        | ( "timestamp" )

variable_declaration: {VARIABLE} datatype ";"
                    | {VARIABLE} datatype ":=" e ";"

block: 'declare' e 'begin' e 'end'
     | 'begin' e 'end'
