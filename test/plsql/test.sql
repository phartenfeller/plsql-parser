create or replace package body lct_element_types_api
as

  gc_scope constant logger_logs.scope%type := $$plsql_unit || '.';

  function get_db_checksum
  (
    pi_eltp_id in lct_element_types.eltp_id%type
  )
    return types_pkg.t_checksum
  as
    l_scope  constant logger_logs.scope%type := gc_scope || 'get_db_checksum';
    l_params logger.tab_param;
    l_return types_pkg.t_checksum;
  begin
    logger.append_param( p_params => l_params, p_name => 'pi_eltp_id', p_val => pi_eltp_id );
    logger.log( p_text => 'START', p_scope => l_scope, p_params => l_params );

    select to_char(eltp_updated_on, global_constants_pkg.gc_timestamp_checksum_fmt)
      into l_return
      from lct_element_types
     where eltp_id = pi_eltp_id
    ;

    logger.append_param( p_params => l_params, p_name => 'l_return', p_val => l_return );
    logger.log( p_text => 'END', p_scope => l_scope, p_params => l_params );

    return l_return;
  exception
    when others then
      logger.log_error( p_text => 'Unexpected Error', p_scope => l_scope, p_params => l_params );
      raise;
  end get_db_checksum;

  procedure insert_record
  (
    pio_eltp_id in out lct_element_types.eltp_id%type
  , pi_eltp_name in lct_element_types.eltp_name%type
  , pi_eltp_internal_name in lct_element_types.eltp_internal_name%type 
  , pi_user in types_pkg.t_user
  )
  as
    l_scope  constant logger_logs.scope%type := gc_scope || 'insert_record';
    l_params logger.tab_param;
  begin
    logger.append_param( p_params => l_params, p_name => 'pio_eltp_id', p_val => pio_eltp_id );
    logger.append_param( p_params => l_params, p_name => 'pi_eltp_name', p_val => pi_eltp_name );
    logger.append_param( p_params => l_params, p_name => 'pi_eltp_internal_name', p_val => pi_eltp_internal_name );
    logger.append_param( p_params => l_params, p_name => 'pi_user', p_val => pi_user );
    logger.log( p_text => 'START', p_scope => l_scope, p_params => l_params );

    insert
      into lct_element_types
           (
             eltp_id
           , eltp_name
           , eltp_internal_name
           , eltp_created_by
           , eltp_updated_by
           )
    values (
             pio_eltp_id
           , pi_eltp_name
           , pi_eltp_internal_name
           , pi_user
           , pi_user
           )
    returning eltp_id into pio_eltp_id
    ;

    logger.append_param( p_params => l_params, p_name => 'pio_eltp_id', p_val => pio_eltp_id );
    logger.log( p_text => 'END', p_scope => l_scope, p_params => l_params );
  exception
    when others then
      logger.log_error( p_text => 'Unexpected Error', p_scope => l_scope, p_params => l_params );
      raise;
  end insert_record;

  procedure update_record
  (
    pi_eltp_id in lct_element_types.eltp_id%type
  , pi_eltp_name in lct_element_types.eltp_name%type
  , pi_eltp_internal_name in lct_element_types.eltp_internal_name%type 
  , pi_user in types_pkg.t_user
  , pi_checksum in types_pkg.t_checksum
  )
  as
    l_scope  constant logger_logs.scope%type := gc_scope || 'update_record';
    l_params logger.tab_param;
  begin
    logger.append_param( p_params => l_params, p_name => 'pi_eltp_id', p_val => pi_eltp_id );
    logger.append_param( p_params => l_params, p_name => 'pi_eltp_name', p_val => pi_eltp_name );
    logger.append_param( p_params => l_params, p_name => 'pi_eltp_internal_name', p_val => pi_eltp_internal_name );
    logger.append_param( p_params => l_params, p_name => 'pi_user', p_val => pi_user );
    logger.append_param( p_params => l_params, p_name => 'pi_checksum', p_val => pi_checksum );
    logger.log( p_text => 'START', p_scope => l_scope, p_params => l_params );
    
    if pi_checksum = get_db_checksum(pi_eltp_id => pi_eltp_id) then
      update lct_element_types
         set eltp_name = pi_eltp_name
           , eltp_internal_name = pi_eltp_internal_name
           , eltp_updated_by = pi_user
           , eltp_updated_on = systimestamp
       where eltp_id = pi_eltp_id
      ;
    else
      raise global_constants_pkg.e_checksum_mismatch;
    end if;

    logger.log( p_text => 'END', p_scope => l_scope, p_params => l_params );
  exception
    when others then
      logger.log_error( p_text => 'Unexpected Error', p_scope => l_scope, p_params => l_params );
      raise;
  end update_record;

  procedure delete_record
  (
    pi_eltp_id in lct_element_types.eltp_id%type 
  , pi_user in types_pkg.t_user
  , pi_checksum in types_pkg.t_checksum
  )
  as
    l_scope  constant logger_logs.scope%type := gc_scope || 'delete_record';
    l_params logger.tab_param;
  begin
    logger.append_param( p_params => l_params, p_name => 'pi_eltp_id', p_val => pi_eltp_id );
    logger.append_param( p_params => l_params, p_name => 'pi_user', p_val => pi_user );
    logger.append_param( p_params => l_params, p_name => 'pi_checksum', p_val => pi_checksum );
    logger.log( p_text => 'START', p_scope => l_scope, p_params => l_params );

    if pi_checksum = get_db_checksum(pi_eltp_id => pi_eltp_id) then
      delete
        from lct_element_types
       where eltp_id = pi_eltp_id
      ;
    else
      raise global_constants_pkg.e_checksum_mismatch;
    end if;

    logger.log( p_text => 'END', p_scope => l_scope, p_params => l_params );
  exception
    when others then
      logger.log_error( p_text => 'Unexpected Error', p_scope => l_scope, p_params => l_params );
      raise;
  end delete_record;

  procedure get_record
  (
    pi_eltp_id in lct_element_types.eltp_id%type
  , po_eltp_name out nocopy lct_element_types.eltp_name%type
  , po_eltp_internal_name out nocopy lct_element_types.eltp_internal_name%type 
  , po_checksum out nocopy types_pkg.t_checksum
  )
  as
    l_scope  constant logger_logs.scope%type := gc_scope || 'get_record';
    l_params logger.tab_param;
  begin
    logger.append_param( p_params => l_params, p_name => 'pi_eltp_id', p_val => pi_eltp_id );
    logger.log( p_text => 'START', p_scope => l_scope, p_params => l_params );

    select eltp_name
         , eltp_internal_name
         , to_char(eltp_updated_on, global_constants_pkg.gc_timestamp_checksum_fmt)
      into po_eltp_name
         , po_eltp_internal_name
         , po_checksum
      from lct_element_types
     where 1=1
       and eltp_id = pi_eltp_id
    ;

    logger.append_param( p_params => l_params, p_name => 'po_eltp_name', p_val => po_eltp_name );
    logger.append_param( p_params => l_params, p_name => 'po_eltp_internal_name', p_val => po_eltp_internal_name );
    logger.append_param( p_params => l_params, p_name => 'po_checksum', p_val => po_checksum );
    logger.log( p_text => 'END', p_scope => l_scope, p_params => l_params );
  exception
    when others then
      logger.log_error( p_text => 'Unexpected Error', p_scope => l_scope, p_params => l_params );
      raise;
  end get_record;

end lct_element_types_api;
/
