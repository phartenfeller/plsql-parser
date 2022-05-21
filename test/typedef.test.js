const parse = require('../src/components/mainParser/recoveryParser');

describe('TypeDef', () => {
  test('table type', () => {
    const code = `
      declare
        type t_translation_cache is table of varchar2(32000) index by varchar2(550);
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('record type', () => {
    const code = `
      declare
        type t_my_type is record (
          my_id  number
        , my_str mytable.col%type
        , my_ts  timestamp(6)
        );
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('table type on record type', () => {
    const code = `
      declare
        type t_my_type is record (
          my_id  number
        , my_str mytable.col%type
        , my_ts  timestamp(6)
        );

        type t_translation_cache is table of t_my_type;
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });
});
