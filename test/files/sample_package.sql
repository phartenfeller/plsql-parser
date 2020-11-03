create or replace package body process_webserver_logs as

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


  function get_timestamp (
    pi_string in varchar2
  ) return timestamp with time zone deterministic
  as
    l_ts timestamp with time zone;
  begin
    select TO_UTC_TIMESTAMP_TZ(pi_string)
      into l_ts
      from dual
    ;

    return l_ts;
  exception
    when others then
      log_error (
        pi_error_message => sqlerrm
      , pi_tbl => null
      , pi_val => pi_string
      , pi_id  => g_id
      , pi_info => 'get_timestamp'
      );
  end get_timestamp;


  function get_or_insert_value (
    pi_tbl_name in varchar2
  , pi_val      in varchar2
  ) return number deterministic result_cache
  as
    l_select_sql varchar2(4000);
    l_id         number;
  begin
    if pi_val is null then 
      return null;
    end if;

    l_select_sql := 'select id from ' || pi_tbl_name || ' where val = :1';

    begin
      execute immediate l_select_sql into l_id using pi_val;
    exception 
      when NO_DATA_FOUND then
        null;
      when others then
        raise;
    end;

    if l_id is not null then
      return l_id;
    else
      l_select_sql := 'insert into ' || pi_tbl_name || ' (val) values (:1) returning id into :new_id';
       execute immediate l_select_sql using in pi_val, out l_id;
       return l_id;
    end if;

  exception
    when others then
      log_error (
        pi_error_message => sqlerrm
      , pi_tbl => pi_tbl_name
      , pi_val => pi_val
      , pi_id  => g_id
      , pi_info => 'get_or_insert_value'
      );
  end get_or_insert_value; 


  procedure process_date
  as
    l_obj json_object_t;
    l_sr_row server_requests%rowtype;
  begin
    for rec in (
      select *
        from webserverlogs
       where failed is null
    )
    loop
      begin
        g_id := rec.id;

        l_sr_row := null;
        l_obj := JSON_OBJECT_T(rec.logdata);

        l_sr_row.client_host := get_or_insert_value('ip_addresses', l_obj.get_string('ClientHost'));
        l_sr_row.client_port := l_obj.get_number('ClientPort');
        l_sr_row.downstream_content_size := l_obj.get_number('DownstreamContentSize');
        l_sr_row.downstream_cache_control := get_or_insert_value('cache_control', l_obj.get_string('downstream_Cache-Control'));
        l_sr_row.downstream_status := l_obj.get_number('DownstreamStatus');
        l_sr_row.duration := l_obj.get_number('Duration');
        l_sr_row.request_address := get_or_insert_value('request_address', l_obj.get_string('RequestAddr'));
        l_sr_row.request_host := get_or_insert_value('hosts', l_obj.get_string('RequestHost'));
        l_sr_row.request_path := get_or_insert_value('request_paths', l_obj.get_string('RequestPath'));
        l_sr_row.request_method := get_or_insert_value('request_methods', l_obj.get_string('RequestMethod'));
        l_sr_row.request_protocol := get_or_insert_value('request_protocol', l_obj.get_string('RequestProtocol'));
        l_sr_row.request_purpose := get_or_insert_value('request_purpose', l_obj.get_string('request_Purpose'));
        l_sr_row.request_se := get_or_insert_value('request_se', l_obj.get_string('request_Sec-Fetch-Dest'));
        l_sr_row.retry_attempts := get_or_insert_value('request_se', l_obj.get_number('RetryAttempts-Fetch-Dest'));
        l_sr_row.time := get_timestamp(l_obj.get_string('time'));
        l_sr_row.loglevel := get_or_insert_value('loglevel', l_obj.get_string('level'));
        l_sr_row.accept_encoding := get_or_insert_value('accept_encoding', l_obj.get_string('request_Accept-Encoding'));
        l_sr_row.accept_language := get_or_insert_value('accept_language', l_obj.get_string('request_Accept-Language'));
        l_sr_row.user_agent := get_or_insert_value('user_agents', l_obj.get_string('request_User-Agent'));
        l_sr_row.content_type := get_or_insert_value('content_type', l_obj.get_string('downstream_Content-Type'));
        l_sr_row.request_referer := get_or_insert_value('request_referer', l_obj.get_string('request_Referer'));

        insert into server_requests values l_sr_row;

        delete from webserverlogs where id = g_id;

        commit;
      exception
        when others then
          rollback;
          log_error (
              pi_error_message => sqlerrm
            , pi_tbl => null
            , pi_val => null
            , pi_id  => g_id
            , pi_info => 'exception in loop'
          );

          update webserverlogs
            set failed = 1
          where id = g_id;
          
          commit;
      end;
    end loop;
  end process_date;

end process_webserver_logs;
