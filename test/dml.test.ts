import parse from '../src/components/mainParser/recoveryParser';

describe('DML statement', () => {
  test('delete with from', () => {
    const code = `
      begin
        delete from my_table
         where my_category = 'dogs';
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('delete without from', () => {
    const code = `
      begin
        delete my_table
         where my_category = 'dogs';
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('forall insert', () => {
    const code = `
    begin
      forall i in 1 .. g_logs.count
        insert into my_log_table
          ( log_id
          , log_message
          , log_created_at
          )
        values
          ( g_logs(i).log_fdl_id
          , g_logs(i).log_message
          , g_logs(i).log_created_at
          );
    end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('forall update', () => {
    const code = `
    begin
      forall i in 1 .. g_logs.count
        update my_log_table
           set log_message    = g_logs(i).log_message
             , log_created_at = g_logs(i).log_created_at
         where log_id = g_logs(i).log_fdl_id
        ;
    end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('forall delete', () => {
    const code = `
    begin
      forall i in 1 .. g_logs.count
        delete my_log_table
         where log_id =  g_logs(i).log_fdl_id
        ;
    end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });
});
