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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
  });

  test('boolean from smaller', () => {
    const code = `
      declare 
        l_bool boolean;
      begin
        l_bool := 1 < 3;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('boolean from chained condition', () => {
    const code = `
      declare 
        l_bool boolean;
      begin
        l_bool := 1 < 3 and 1 < 2;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('boolean from chained with is not null', () => {
    const code = `
      declare 
        l_num  number := 1;
        l_bool boolean;
      begin
        l_bool := 1 < 3 and l_num is not null;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('boolean from chained with not', () => {
    const code = `
      declare 
        l_num  number := 1;
        l_bool boolean;
      begin
        l_bool := 1 < 3 and not 1 = -1;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('boolean from member of', () => {
    const code = `
    declare
      l_arr apex_t_varchar2 := apex_t_varchar2('one', 'two');
      l_bool boolean;
    begin
      l_bool := 'one' member of (l_arr);
    end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
  });

  test('alternate quoting string 1', () => {
    const code = `
    declare
      l_str varchar2(255 char);
    begin
      l_str := q'[ what is ' up ' here ' ?']';
    end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('alternate quoting string 2', () => {
    const code = `
    declare
      l_str varchar2(255 char);
    begin
      l_str := q'! what is ' up ' here ' ?'!';
    end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('alternate quoting string multiline', () => {
    const code = `
    declare
      l_str varchar2(255 char);
    begin
      l_str := q'( 
          what is '
       up ' here ' ?')';
    end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });
});
