declare
  l_num number := 2;
begin
  l_num := l_num + 5;
  l_num := 3 - 7;
  l_num := 1222 / 8;
  l_num := 1.4 * 9;
  l_num := l_num + l_num / l_num * 2;

  l_num := get_random_number(64 + get_random_number(12 / 2));

  l_num := (l_num - 12) / 100;
end;
