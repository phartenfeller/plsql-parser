declare
  l_num1 number := 1;
  l_num2 number := 4;
  l_bool boolean := true;
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
  else
    null;
  end if;
end;
