declare
  l_num1 number := 1;
  l_num2 number := 4;
  l_bool boolean := true;
  l_arr apex_t_varchar2 := apex_t_varchar2('one', 'two');
begin
  null;

  if l_num2 > l_num1 then
    null;
  elsif l_num2 < l_num1 then
    null;
  elsif 5 + 2 >= 7 then
    null;
  elsif nvl(lengthb(p_vc_buffer), 0) + nvl(lengthb(p_vc_addition), 0) < 32767 then
    null;
  elsif l_bool then
    null;
  elsif my_cool_func(0) then 
    null;
  elsif my_pkg.my_cool_func('test') then
    null;
  elsif l_bool and 5 + 2 >= 7 then
    null;
  elsif l_num2 < l_num1 or 1 + 3 >= 0 and l_bool then
    null;
  elsif not my_pkg.my_cool_func('test') then
    null;
  elsif ((1 + 2 = 3 and false) or  0 + 1 * 0  = 0) then
    null;
  elsif ( 1 + 1 = 2 and 3 - 2 * 0 = 0) or 1 = 1 then
    null;
  elsif t_numfmtid IS NULL
         AND NOT (    workbook.sheets_tab (t_sheet).col_fmts_tab.EXISTS (p_col)
                  AND workbook.sheets_tab (t_sheet).col_fmts_tab (p_col).pi_numfmtid IS NOT NULL
                  )
              then
    null;
  elsif 'one' member of (l_arr) then
    null;
  else
    null;
  end if;
end;
