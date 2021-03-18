create package body my_json_test_pkg as

  gc_scope constant logger_logs.scope%type := $$plsql_unit || '.';

  ------------------------------------------------------------------------------
  -- builds a case object in json form containing all associated steps
  ------------------------------------------------------------------------------
  function json_tests (
    pi_json_id in number
  ) return json_object_t
  as
    l_scope  constant logger_logs.scope%type := gc_scope || 'build_case_json_object';
    l_params logger.tab_param;

    l_data         json_object_t;
    l_steps_array  json_array_t;
  begin
    logger.append_param( p_params => l_params, p_name => 'pi_json_id', p_val => pi_json_id );
    logger.log( p_text => 'START', p_scope => l_scope, p_params => l_params );

    l_data := json_object_t();
    l_data.put('fav_number', 7);
    l_data.put('key', 'value');
    l_steps_array := json_array_t ('[]');

    for rec in (
      select * 
        from fbi_suspects
    )
    loop
      l_steps_array.append( json_object_t(rec.name) );
    end loop;

    l_data.put ('suspects', l_steps_array);

    logger.append_param( p_params => l_params, p_name => 'l_data', p_val => l_data.stringify );
    logger.log( p_text => 'END', p_scope => l_scope, p_params => l_params );

    return l_data;
  exception
    when others then
      logger.log_error( p_text => 'Unexpected Error', p_scope => l_scope, p_params => l_params );
      raise;
  end json_tests;

end my_json_test_pkg;
/

