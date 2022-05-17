const parse = require('../src/components/mainParser/recoveryParser');

describe('values', () => {
  test('sql%rowcount', () => {
    const code = `
      declare 
        l_my_str varchar2(255 char);
      begin
        l_my_str := 'hello' || sql%rowcount;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('boolean from equals', () => {
    const code = `
      declare 
        l_bool boolean;
      begin
        l_bool := 1 = 2;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });
});
