create or replace package test_pkg
as
  -- test

  g_my_global_var pls_integer := 1;

  function get_time_string (
    pi_date in date
  , pi_vc   in varchar2
  ) return varchar2 deterministic result_cache
  ;

  procedure very_important_business_process (
    pi_date    in date
  , po_money   out nocopy number 
  , pio_error  in out boolean
  , po_money2  out number 
  , pio_error2 in out nocopy boolean
  );

end test_pkg;
