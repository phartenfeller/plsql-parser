const path = require('path');
const { readdirSync, readFileSync } = require('fs');
const parse = require('../src/components/mainParser/recoveryParser');

const directoryPath = path.join(__dirname, 'files');

const filesArray = readdirSync(directoryPath, (err, files) => {
  if (err) {
    throw new Error(`Unable to scan directory: ${err}`);
  }

  return files;
});

filesArray.forEach((file) => {
  const content = readFileSync(path.join(directoryPath, file)).toString();
  test(file, () => {
    const result = parse(content, false);
    const { errors } = result;
    expect(errors).toStrictEqual([]);
  });
});
