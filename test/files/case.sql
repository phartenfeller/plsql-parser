declare
  l_num pls_integer := 100;
  l_str varchar2(200 char) := 'hello';
  l_weird_functions varchar2(100 char);
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

  l_str := case 
              when l_num = 1 then 'one'
              when l_num = 2 then 'two'
              else 'idk'
           end;


  l_weird_functions := case
                when p_col > 702
                then
                      chr (64 + trunc ( (p_col - 27) / 676))
                   || chr (65 + mod (trunc ( (p_col - 1) / 26) - 1, 26))
                   || chr (65 + mod (p_col - 1, 26))
                when p_col > 26
                then
                   chr (64 + trunc ( (p_col - 1) / 26)) || chr (65 + mod (p_col - 1, 26))
                else
                   chr (64 + p_col)
             end;
end;
