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

  l_complex_string varchar2(100 char) := chr(64 + trunc ((p_col - 27) / 676)) || chr (65 + mod (trunc ( (p_col - 1) / 26) - 1, 26));

  
begin
  my_object.value(l_index) := 'test';
  my_object.value(NVL(p_string, '')) := t_cnt;
  workbook.sheets_tab(t_nr).vc_sheet_name := 'test';
  t_row_ind := workbook.sheets_tab(s).sheet_rows_tab.first;
  workbook.sheets_tab(s).sheet_rows_tab(t_row_ind).delete; -- delete function on table arrays
  workbook.sheets_tab(t_sheet).sheet_rows_tab(p_row)(p_col).nn_value_id := p_value;
  gv_authors_tab(workbook.sheets_tab(s).comments_tab(c).vc_author) := 0;
  l_test := t_desc_tab(c).col_name;
end;
