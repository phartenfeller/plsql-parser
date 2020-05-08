const path = require('path');
const { readdirSync, readFileSync } = require('fs');
const { parse } = require('../chevrotain/rules');

const directoryPath = path.join(__dirname, 'files');

const filesArray = readdirSync(directoryPath, (err, files) => {
  if (err) {
    throw new Error(`Unable to scan directory: ${err}`);
  }

  return files;
});

filesArray.forEach(file => {
  const content = readFileSync(path.join(directoryPath, file)).toString();
  test(file, () => {
    expect(parse(content).errors).toStrictEqual([]);
  });
});
