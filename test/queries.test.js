const { parse } = require('../src/components/mainParser/rules');

describe('Queries', () => {
  test('from table on array', () => {
    const code = `
      begin
        select *
          from table(l_id_arr)
         where 1 != 2;
      end;
    `;

    const result = parse(code, false);
    const { errors } = result;
    expect(errors).toStrictEqual([]);
  });

  test('Like Concat', () => {
    const code = `
      declare
        l_num pls_integer := 14;
      begin
        select test_id
          from test_table
         where test_table_name like 'My table - ' || l_num || ' #%';
      end;
    `;

    const result = parse(code, false);
    const { errors } = result;
    expect(errors).toStrictEqual([]);
  });

  test('In constants', () => {
    const code = `
      begin
        select test_id
          from test_table
         where test_status in ( my_test_api.c_status_scheduled, my_test_api.c_status_running );
      end;
    `;

    const result = parse(code, false);
    const { errors } = result;
    expect(errors).toStrictEqual([]);
  });

  test('Not in constants', () => {
    const code = `
      begin
        select test_id
          from test_table
         where test_status not in ( my_test_api.c_status_scheduled, my_test_api.c_status_running );
      end;
    `;

    const result = parse(code, false);
    const { errors } = result;
    expect(errors).toStrictEqual([]);
  });

  test('In subquery', () => {
    const code = `
      begin
        select test_id
          from test_table
         where test_status in ( select my_col from my_table );
      end;
    `;

    const result = parse(code, false);
    const { errors } = result;
    expect(errors).toStrictEqual([]);
  });

  test('In table on array', () => {
    const code = `
      begin
        select test_id
          from test_table
         where test_status in ( select * from table(l_id_arr) );
      end;
    `;

    const result = parse(code, false);
    const { errors } = result;
    expect(errors).toStrictEqual([]);
  });

  test('Bulk collect', () => {
    const code = `
      declare
        l_id_arr apex_t_number;
      begin
        select test_id
          bulk collect into l_id_arr
          from test_table
         where 1 = 1;
      end;
    `;

    const result = parse(code, false);
    const { errors } = result;
    expect(errors).toStrictEqual([]);
  });
});
