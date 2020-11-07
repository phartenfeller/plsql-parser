declare
  l_num pls_integer := 100;
  l_str varchar2(200 char) := 'hello';
begin
  case l_num
    when 1 then
      null;
    when 2 then
      null;
    else
      null;
  end case;

  case
    when l_num = 1 then
      null;
    when l_str = 'what' then
      null;
    else
      null;
  end case;
end;
