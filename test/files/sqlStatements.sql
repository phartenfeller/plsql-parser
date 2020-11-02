begin
  select * from dual;

  select col1, col2, col3
    from my_table
   where col1 = 'testign'
     and col3 = sysdate
      or col2 = 3
  ;
end;
