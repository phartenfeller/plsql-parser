import parse from '../src/components/mainParser/recoveryParser';

describe('statements', () => {
  test('pipe_row', () => {
    const code = `
      begin
        pipe row(my_array(1));
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('goto label declaration', () => {
    const code = `
      begin
        <<my_goto_label>>
          null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('use goto command', () => {
    const code = `
      begin
        goto my_goto_label;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
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
    expect(result.errors.length).toBe(0);
  });
});
