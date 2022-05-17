const parse = require('../src/components/mainParser/recoveryParser');

describe('exceptions', () => {
  test('declare exception', () => {
    const code = `
      declare
        e_my_exception exception;
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('declare exception', () => {
    const code = `
      declare
      begin
        raise e_my_exception;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('listen on exception', () => {
    const code = `
      declare
      begin
        raise e_my_exception;
      exception
        when e_my_exception then
          null;
        when no_data_found then
          my_logger.error('No data found');
          raise;
        when others then
          raise;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('nested raise in exception block', () => {
    const code = `
      declare
      begin
        raise e_my_exception;
      exception
        when e_my_exception then
          if 1 < 2 then
            raise;
          end if;
        when others then
          raise;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });
});
