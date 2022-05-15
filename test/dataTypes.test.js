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
});

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
});
