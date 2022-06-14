import parse from '../src/components/mainParser/recoveryParser';

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

  test('boolean from in', () => {
    const code = `
      declare 
        l_bool boolean;
      begin
        l_bool := color_type in ( 0, 4 );
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('replace (keyword used as function)', () => {
    const code = `
      declare 
        l_str varchar2(255 char);
      begin
        l_str := replace('hello', 'o', 'i');
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('constant with dollar in name', () => {
    const code = `
      declare 
        l_str varchar2(255 char);
      begin
        l_str := dbms_datapump.ku$_file_type_log_file;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('declare var with default', () => {
    const code = `
      declare 
        l_str varchar2(255 char) default 'hello';
      begin
        null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('Calc with vars', () => {
    const code = `
      declare
        l_years       number := 6;
        l_div_months  number := 3;
        l_months_back number;
      begin
        l_months_back := l_years * 12 / l_div_months;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });
});
