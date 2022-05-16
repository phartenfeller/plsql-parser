const parse = require('../src/components/mainParser/recoveryParser');

describe('statements', () => {
  test('pipe_row', () => {
    const code = `
      begin
        pipe row(my_array(1));
      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });
});
