begin
  insert into my_table
    (col1, col2)
  values
    ('Han', 'Solo')
  ;

  insert into my_table values hansLamdaType;

  update my_table set col1 = 'Frodo', col2 = 'Gollum' where movie = 'LOTR';

  delete from my_table where movie = 'Emoji Movie';
end;
/