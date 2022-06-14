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
    expect(result.errors.length).toBe(0);
  });

  test('delete without from', () => {
    const code = `
      begin
        delete my_table
         where my_category = 'dogs';
      end;
    `;

    const result = parse(code, false);
    expect(result.errors.length).toBe(0);
  });
});
