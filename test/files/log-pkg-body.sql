create or replace package body process_error_logs as

  g_id number := 0;

  procedure log_error (
    pi_error_message in varchar2
  , pi_tbl in varchar2
  , pi_val in varchar2
  , pi_id in number
  , pi_info in varchar2 default null
  )
  as
    pragma autonomous_transaction;
  begin
    insert into process_errors
      (info, error_message, tbl, val, webserverlogs_id)
    values
      (pi_info, pi_error_message, pi_tbl, pi_val, pi_id)
    ;
    commit; 
  end;

end process_error_logs;