import parse from '../src/components/mainParser/recoveryParser';

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
    expect(result.errors.length).toBe(0);
  });

  test('Not like', () => {
    const code = `
      declare
        l_num pls_integer := 14;
      begin
        select test_id
          from test_table
         where test_table_name not like 'ham%';
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
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
    expect(result.errors.length).toBe(0);
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
    expect(result.errors.length).toBe(0);
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
    expect(result.errors.length).toBe(0);
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
    expect(result.errors.length).toBe(0);
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
    expect(result.errors.length).toBe(0);
  });

  test('In table with fc', () => {
    const code = `
      begin
        select extractValue(value(t), '*/Name', l_this_holds_xml) as wow_a_value
          from table(xmlsequence(l_xml.extract('//Parse/My/PLSQL', l_this_holds_xml))
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
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
    expect(result.errors.length).toBe(0);
  });

  test('Join', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          join football_leagues
            on football_clubs.league_id = football_leagues.league_id;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('Left Join', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          left join football_leagues
            on football_clubs.league_id = football_leagues.league_id;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('Right Join', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          right join football_leagues
            on football_clubs.league_id = football_leagues.league_id;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('Inner Join', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          inner join football_leagues
            on football_clubs.league_id = football_leagues.league_id;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('outer Join', () => {
    const code = `
      begin
        select club_name
          from football_clubs
          outer join football_leagues
            on football_clubs.league_id = football_leagues.league_id;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
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
    expect(result.errors.length).toBe(0);
  });

  test('multiple Joins', () => {
    const code = `
      begin
        select club_name, league_name, country_name, dummy
          from football_clubs
          join football_leagues
            on football_clubs.club_league_id = football_leagues.league_id
          left join countries
            on football_leagues.league_country_id = countries.country_id
         cross join dual;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
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
    expect(result.errors.length).toBe(0);
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
    expect(result.errors.length).toBe(0);
  });

  test('table alias', () => {
    const code = `
      begin
        select fc.club_name
             , fl.league_name
          from football_clubs fc
          join football_leagues fl
            on fc.league_id = fl.league_id
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('group by', () => {
    const code = `
      begin
        select fc.club_name
             , fl.league_name
          from football_clubs fc
          join football_leagues fl
            on fc.club_league_id = fl.league_id
         group by fc.club_name, league_name
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('group by having', () => {
    const code = `
      begin
        select count(*) as count
             , fl.league_name
          from football_clubs fc
          join football_leagues fl
            on fc.club_league_id = fl.league_id
         group by fc.club_name, league_name
        having count(*) > 1 and 1 = 1
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('order by', () => {
    const code = `
      begin
        select fc.club_name
             , fl.league_name
          from football_clubs fc
          join football_leagues fl
            on fc.league_id = fl.league_id
         order by 1, fl.league_name
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });

  test('order by fc_call', () => {
    const code = `
      begin
        select fc.club_name
             , fl.league_name
          from football_clubs fc
          join football_leagues fl
            on fc.league_id = fl.league_id
         order by get_num(), fl.league_name
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });
});

test('group by + order by', () => {
  const code = `
    begin
      select count(*) as cnt
           , fl.league_name
        from football_clubs fc
        join football_leagues fl
          on fc.club_league_id = fl.league_id
       group by LEAGUE_NAME
      having count(*) > 0
       order by LEAGUE_NAME;
    end;
  `;

  const result = parse(code, false);
  expect(result.errors.length).toBe(0);
});