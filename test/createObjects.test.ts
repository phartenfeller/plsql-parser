import parse from '../src/components/mainParser/recoveryParser';

describe('Create Objects', () => {
  test('sequence simple', () => {
    const code = `
      create sequence my_sequence;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('sequence increment start with', () => {
    const code = `
    create sequence my_sequence increment by 1 start with 1;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('sequence all a', () => {
    const code = `
    create sequence my_sequence 
      increment by 1 
      start with 1
      maxvalue 150000
      minvalue 1
      cycle
      cache 25
      order
    ;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('sequence all b', () => {
    const code = `
    create sequence my_sequence 
      increment by 1 
      start with 1
      nomaxvalue
      nominvalue
      nocycle
      nocache
      noorder
    ;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('sequence all a changed order', () => {
    const code = `
    create sequence my_sequence 
      start with 1
      maxvalue 150000
      cycle
      minvalue 1
      increment by 1 
      order
      cache 25
    ;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('simple view', () => {
    const code = `
    create view my_view as 
      select * from my_table
    ;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('simple view (or replace)', () => {
    const code = `
    create or replace view my_view as 
      select * from my_table
    ;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('simple view force', () => {
    const code = `
    create or replace force view my_view as 
      select * from my_table
    ;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });

  test('simple view no force', () => {
    const code = `
    create or replace no force view my_view as 
      select * from my_table
    ;
    `;

    const result = parse(code, false);
    expect(result.errors).toStrictEqual([]);
  });
});
