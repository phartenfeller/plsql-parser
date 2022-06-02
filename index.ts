import parse from './src/components/mainParser/recoveryParser';

function parsePlSql(code: string) {
  try {
    if (!code || typeof code !== 'string') {
      throw new Error('Code is empty or not a string');
    }
    const result = parse(code, true);
    return result;
  } catch (err) {
    throw new Error(`Parsing error occured: ${err}`);
  }
}

export default parsePlSql;
