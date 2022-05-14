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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
  });

  test('Join', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          join football_leauges
            on football_clubs.league_id = football_leauges.league_id;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('Left Join', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          left join football_leauges
            on football_clubs.league_id = football_leauges.league_id;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('Right Join', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          right join football_leauges
            on football_clubs.league_id = football_leauges.league_id;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('Inner Join', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          inner join football_leauges
            on football_clubs.league_id = football_leauges.league_id;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('outer Join', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          outer join football_leauges
            on football_clubs.league_id = football_leauges.league_id;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('cross Join', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          cross join dual;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('multiple Joins', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          join football_leauges
            on football_clubs.league_id = football_leauges.league_id
          left join countries
            on football_leauges.country_id = countries.country_id
          cross join dual;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('column alias as', () => {
    const code = `
      begin
        select club_name as name
             , club_id as id
          from football_clubs
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('column alias no as', () => {
    const code = `
      begin
        select club_name name
             , club_id id
          from football_clubs
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('table alias', () => {
    const code = `
      begin
        select fc.club_name
             , fl.league_name
          from football_clubs fc
          join football_leauges fl
            on fc.league_id = fl.league_id
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('order by', () => {
    const code = `
      begin
        select fc.club_name
             , fl.league_name
          from football_clubs fc
          join football_leauges fl
            on fc.league_id = fl.league_id
         order by 1, fl.league_name
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });
});
