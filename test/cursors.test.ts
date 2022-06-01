import parse from '../src/components/mainParser/recoveryParser';

describe('Cursors', () => {
  test('cursor declaration', () => {
    const code = `
      declare
        cursor l_cursor is
          select * from dual
        ;
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('cursor use', () => {
    const code = `
      declare
      begin
        for rec in l_cursor
        loop
          null;
        end loop;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('cursor declaration and use', () => {
    const code = `
      declare
        cursor l_cursor is
          select * from dual
        ;
      begin
        for rec in l_cursor
        loop
          null;
        end loop;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });
});
