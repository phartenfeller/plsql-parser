import parse from '../src/components/mainParser/recoveryParser';

describe('object specifications', () => {
  test('package body cor', () => {
    const code = `
      create or replace package body my_package as
        
        function get_1
          return integer
        as
        begin
          return 1;
        end;

      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('package body c', () => {
    const code = `
      create package body my_package as
        
        function get_1
          return integer
        as
        begin
          return 1;
        end;

      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('package body quoted name', () => {
    const code = `
      create package body "my_package" as
        
        function get_1
          return integer
        as
        begin
          return 1;
        end;

      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('package body with schema', () => {
    const code = `
      create package body my_schema.my_package as
        
        function get_1
          return integer
        as
        begin
          return 1;
        end;

      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('package body with schema quoted', () => {
    const code = `
      create package body my_schema."my_package" as
        
        function get_1
          return integer
        as
        begin
          return 1;
        end;

      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('package spec with schema quoted', () => {
    const code = `
      create package my_schema."my_package" as
        
        function get_1
          return integer
        ;

      end;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('package body with pragma', () => {
    const code = `
    create or replace package body my_pkg as
      e_my_cust_error exception;
      pragma exception_init(e_my_cust_error, -20111);
    
      function get_1
        return integer
      as
      begin
        return 1;
      end;

    end my_pkg;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('package spec with pragma', () => {
    const code = `
    create or replace package my_pkg as
      e_my_cust_error exception;
      pragma exception_init(e_my_cust_error, -20111);

      function get_1
        return integer
      ;

    end my_pkg;
  `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });
});
