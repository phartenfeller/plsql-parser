declare
  l_num1 number := 1;
  l_num2 number := 4; 
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
  else
    null;
  end if;
end;
