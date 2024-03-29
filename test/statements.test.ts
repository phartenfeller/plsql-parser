import parse from '../src/components/mainParser/recoveryParser';

describe('statements', () => {
  test('pipe_row', () => {
    const code = `
      begin
        pipe row(my_array(1));
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('goto label declaration', () => {
    const code = `
      begin
        <<my_goto_label>>
          null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('use goto command', () => {
    const code = `
      begin
        goto my_goto_label;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('goto combined', () => {
    const code = `
      declare
        l_num integer := 0;
      begin
        <<my_goto_label>>
        l_num := l_num + 1;

        if l_num <= 10 then
          goto my_goto_label;
        end if;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('select into', () => {
    const code = `
      declare
        l_num integer := 0;
      begin
        select count(*)
          into l_num
          from dual;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('select into type', () => {
    const code = `
      declare
        type t_type is record (
          num_val integer
        );

        l_var t_type;
      begin
        select count(*)
          into l_var.num_val
          from dual;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('extract simple', () => {
    const code = `
      declare
        l_test number;
      begin
        l_test := EXTRACT(HOUR FROM SYSTIMESTAMP);
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('extract in case', () => {
    const code = `
      declare
        l_test number;
      begin
        l_test := CASE WHEN EXTRACT(HOUR FROM SYSTIMESTAMP) >= 15 THEN 1 ELSE 2 END;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('compiler if statement', () => {
    const code = `
    begin
      $if wwv_flow_api.c_current >= 20200331 $then
        select 
          case friendly_url 
              when 'Yes' then 1
              when 'No' then 0
          end  
          into l_is_friendly_url
          from apex_applications 
        where application_id = pi_application_id;
      $else
        l_is_friendly_url := 0;
      $end"
    end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('compiler if statement with error', () => {
    const code = `
    begin
      $if 1 = 1 $then
        null;
      $elsif 1 = 2 $then
        $error 'what is going on why is 1 = 2 ???' $end
      $else
        $error 'what is this number?' || 1 $end
      $end"
    end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });
});
