declare
  l_num1 number(8) := 2;
  l_num2 number(8,4) := 2;
  l_str1 varchar2(2) := 'a string!';
  l_str2 varchar2(12 char) := 'test';
  l_str3 varchar2(400 char) := 'a' || 'concatenated' || 'string' || l_str2;
  l_scope constant logger_logs.scope%type := gc_scope || 'myfunc';
  l_plsi pls_integer := 2;
  l_bool boolean := true;
  l_dat1 date := current_date;
  l_dat2 date := sysdate;
  l_row  my_table%rowtype;
  l_row2 schema.table_name%rowtype;
  l_col  my_table.my_col%type;
  l_col2 schema.table_name.col_name%type;
  l_ts   timestamp := systimestamp;
  l_tstz timestamp with time zone := current_timestamp;

  l_str4 varchar2(12 char) := $$plsql_unit;
  l_str5 varchar2(12 char) := $$plsql_type;
begin
  -- empty
end;
