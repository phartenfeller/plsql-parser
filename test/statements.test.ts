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
});
