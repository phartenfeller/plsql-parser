const parse = require('../src/components/mainParser/recoveryParser');

describe('Data Types', () => {
  test('raw', () => {
    const code = `
      declare
        l_raw raw(2000);
        l_key_bytes_raw raw (64); 
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('timestamp', () => {
    const code = `
      declare
        l_ts timestamp;
        l_ts2 timestamp(6);
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('timestamp tz', () => {
    const code = `
      declare
        l_tsz timestamp with time zone; 
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('inline procedure', () => {
    const code = `
      declare
        procedure delete_log(p_log_id in number)
        as
        begin
          null;
        end delete_log;
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toEqual(0);
  });

  test('inline function', () => {
    const code = `
      declare
        function get_log(p_log_id in number)
          return varchar2
        as
        begin
          return 'ok';
        end get_log;
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toEqual(0);
  });

  test('inline procedure IN FUNCTION', () => {
    const code = `
      declare
        function get_log(p_log_id in number)
            return varchar2
          as
              procedure delete_log(p_log_id in number)
              as
              begin
                null;
              end delete_log;
          begin
            return 'ok';
          end get_log;
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toEqual(0);
  });

  test('inline function IN PROCEDURE', () => {
    const code = `
      declare
        procedure delete_log(p_log_id in number)
        as
            function get_log(p_log_id in number)
              return varchar2
            as          
            begin
              return 'ok';
            end get_log;
        begin
          null;
        end delete_log;
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toEqual(0);
  });
});

/*
  Fail
*/

describe('Data Types Fails', () => {
  test('raw with char', () => {
    const code = `
      declare
        l_raw raw(2000 char);
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toEqual(1);
  });

  test('raw without num', () => {
    const code = `
      declare
        l_raw raw();
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toEqual(1);
  });

  test('raw without brackets', () => {
    const code = `
      declare
        l_raw raw;
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toEqual(1);
  });

  test('timestamp with timezone and number', () => {
    const code = `
      declare
        l_ts2 timestamp with time zone(6); 
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toEqual(1);
  });
});
