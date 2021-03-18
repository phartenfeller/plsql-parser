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
end;
