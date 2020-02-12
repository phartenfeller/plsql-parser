declare
  l_num number := 2;
  l_sup varchar2(13 char) := 'waslos';
  l_was number;
begin
  /* my cool program */
  /* 
    multi
    line
    comment
  */
  -- comment two
  l_num := l_num + 5;
  l_num := 2 - 7;
  l_num := l_num / 8;
  l_num := l_num * 9;
  l_num := l_num + l_num / l_num * 2;
end;
