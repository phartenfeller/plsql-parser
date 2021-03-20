declare
  l_num1 number := 1;
  l_num2 number := 4;
  l_num3 number;
begin
  for l_num1 in 1..4
  loop
    null;
  end loop;

  for l_num3 in l_num1 .. l_num2
  loop
    null;
  end loop;

  for i in get_i() .. myvar.count
  loop
    null;
  end loop;

  for l_rec in (
    select * 
      from dual
     where 1 = 1 
  )
  loop
    null;
  end loop;

  while t_row_ind is not null
  loop
    null;
  end loop;

  while my_val is not null or gv_authors_tab.next (author_ind) is not null
  loop
    null;
  end loop;

end;
