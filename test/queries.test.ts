import parse from '../src/components/mainParser/recoveryParser';

describe('Queries', () => {
  test('table alias', () => {
    const code = `
      begin
        select *
          from dual d
         ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

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

  test('In table with fc', () => {
    const code = `
      begin
        select extractValue(value(t), '*/Name', l_namespace) as wow_a_value
          from table(xmlsequence(l_xml.extract('//Parse/My/PLSQL', l_namespace)))
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('select into', () => {
    const code = `
      declare
        l_num number;
      begin
        select count(*)
          into l_num
          from countries
         where 1 = 1;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('select into type', () => {
    const code = `
      declare
        type t_my_type is record (
          my_num number
        , my_str countries.country_name%type
        , my_ts  timestamp(6)
        );

        l_vals t_my_type;
      begin
        select count(*)
          into l_vals.my_num
          from countries
         where 1 = 1;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('select into type multiple', () => {
    const code = `
      declare
        type t_my_type is record (
          my_num number
        , my_str countries.country_name%type
        , my_ts  timestamp(6)
        );

        l_vals t_my_type;
      begin
        select count(*), 'what'
          into l_vals.my_num, l_vals.my_str
          from countries
         where 1 = 1;
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
          join football_leagues
            on football_clubs.league_id = football_leagues.league_id;
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
          left join football_leagues
            on football_clubs.league_id = football_leagues.league_id;
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
          right join football_leagues
            on football_clubs.league_id = football_leagues.league_id;
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
          inner join football_leagues
            on football_clubs.league_id = football_leagues.league_id;
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
          outer join football_leagues
            on football_clubs.league_id = football_leagues.league_id;
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
          join football_leagues fl
            on fc.league_id = fl.league_id
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
  });

  test('order by asc desc', () => {
    const code = `
      begin
        select fc.club_name
             , fl.league_name
          from football_clubs fc
          join football_leagues fl
            on fc.league_id = fl.league_id
         order by 1 desc, fl.league_name asc
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('order by nulls first last', () => {
    const code = `
      begin
        select fc.club_name
             , fl.league_name
          from football_clubs fc
          join football_leagues fl
            on fc.league_id = fl.league_id
         order by 1 desc nulls first, fl.league_name asc nulls last
        ;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
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
    expect(result.errors).toStrictEqual([]);
  });

  test('with clause', () => {
    const code = `
    begin
      with data as (
        select club_id, club_name
          from football_clubs
      )
      select * 
        from data
      ;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('multiple with clause', () => {
    const code = `
    begin
      with clubs as (
        select club_id, club_name, club_league_id
          from football_clubs
      ), leauges as (
        select * 
          from clubs
          join football_leagues
            on club_league_id = league_id
      ), data as (
        select l.* , club_id+1
          from leauges l
      )
      select * 
        from data
      ;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('select other schema', () => {
    const code = `
    begin
      select *
        from other_schema.employees e;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('join other schema', () => {
    const code = `
    begin
      select *
        from employees e
        join other_schema.departments d
          on e.detpno = d.deptno;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('window function simple over partition', () => {
    const code = `
    begin
      select empno
           , deptno
           , sal
           , first_value(sal) over (partition by deptno) as first_sal_in_dept
        from emp;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('window function simple over partition + order', () => {
    const code = `
    begin
      select empno
           , deptno
           , sal
           , first_value(sal) over (partition by deptno order by sal asc nulls last) as first_sal_in_dept
        from emp;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('simple listagg', () => {
    const code = `
    begin
      select department_id
           , listagg(last_name, '; ') within group (order by hire_date) "employees"
        from employees
       group by department_id
       order by department_id;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('anlaytic listagg', () => {
    const code = `
    begin
      select department_id
           , hire_date
           , last_name
           , listagg(last_name, '; ') within group (order by hire_date, last_name) over (partition by department_id) as "emp_list"
        from employees
       where hire_date < '01-SEP-2003'
       order by 1, 2, 3;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('from multiple tables', () => {
    const code = `
      begin
        select *
          from dual d
             , football_clubs f;
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('select from subquery', () => {
    const code = `
    begin
      select * from ( select * from football_clubs);
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('select from table + subquery', () => {
    const code = `
    begin
      select * 
        from dual d
           , ( select * from football_clubs) f;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('fetch first rows only', () => {
    const code = `
    begin
      select * 
        from football_clubs
       fetch first 5 rows only
      ;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('fetch first rows with ties', () => {
    const code = `
    begin
      select * 
        from football_clubs
       fetch first 5 rows with ties
      ;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('fetch first row only', () => {
    const code = `
    begin
      select * 
        from football_clubs
       fetch first row only
      ;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('fetch first 5 percent rows only', () => {
    const code = `
    begin
      select * 
        from football_clubs
       fetch first 5 percent rows only
      ;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('offset rows', () => {
    const code = `
    begin
      select * 
        from football_clubs
      offset 5 rows
      ;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('offset and fetch next', () => {
    const code = `
    begin
      select * 
        from football_clubs
      offset 10 rows
       fetch next 7 rows only
      ;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('subquery in where', () => {
    const code = `
    begin
      select * 
        from football_clubs
       where club_id = (select max(club_id) from football_clubs)
      ;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('case global in query', () => {
    const code = `
    begin
     select case to_number('2')
              when 1 then 2
              else 3
            end as element
      from dual;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('basic json table', () => {
    // src: src: https://oracle-base.com/articles/18c/json_table-enhancements-18c
    const code = `
    begin
      select jt.*
        from json_documents,
             json_table(
                data
              , '$'
                columns ( first_name    varchar2(50 char) path '$.FirstName',
                          last_name     varchar2(50 char) path '$.LastName',
                          job           varchar2(10 char) path '$.Job',
                          active        varchar2(5 char)  path '$.Active'
                        )
              ) jt;
      end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('basic json table no data types', () => {
    // src: src: https://oracle-base.com/articles/18c/json_table-enhancements-18c
    const code = `
    begin
      select jt.*
        from json_documents,
             json_table(
                data
              , '$'
                columns ( first_name  path '$.FirstName',
                          last_name   path '$.LastName',
                          job         path '$.Job',
                          active      path '$.Active'
                        )
              ) jt;
      end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('basic json table with format json', () => {
    // src: src: https://oracle-base.com/articles/18c/json_table-enhancements-18c
    const code = `
    begin
      select jt.*
        from json_documents,
             json_table(
                 data
               , '$'
                 columns ( first_name               path '$.FirstName',
                           last_name                path '$.LastName',
                           job                      path '$.Job',
                           active                   path '$.Active',
                           address     format json  path '$.Address'
                         )
               ) jt;
    end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('json table with aliased table', () => {
    // src: src: https://oracle-base.com/articles/18c/json_table-enhancements-18c
    const code = `
    begin
      select jt.*
        from json_documents jd,
             json_table(
                jd.data
              , '$'
                columns ( first_name    varchar2(50 char) path '$.FirstName',
                          last_name     varchar2(50 char) path '$.LastName',
                          job           varchar2(10 char) path '$.Job',
                          active        varchar2(5 char)  path '$.Active'
                        )
              ) jt;
      end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('json table in hack', () => {
    // src: src: https://oracle-base.com/articles/18c/json_table-enhancements-18c
    const code = `
    begin
      select proj_id
        from json_table (
          '[' || l_comma_sperated_ids ||']'
        , '$[*]' 
        columns single_id number path '$'
        );
      end;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });
});
