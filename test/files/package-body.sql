create or replace package body test_pkg
as
  -- test

  g_my_global_var pls_integer := 1;

  function get_time_string (
    pi_date in date
  , pi_vc   in varchar2
  ) return varchar2 deterministic result_cache
  as
    l_my_time varchar2 := '2020-05-08 22:06';
  begin
    return l_my_time;
  end;

  procedure very_important_business_process (
    pi_date    in date
  , po_money   out nocopy number 
  , pio_error  in out boolean
  , po_money2  out number 
  , pio_error2 in out nocopy boolean
  )
  as
  begin
    null;
  exception
    when dup_val_on_index then
      null;
    when others then
      null;
  end very_important_business_process;

end test_pkg;
