import * as path from 'path';
import { readdirSync, readFileSync } from 'fs';
import parse from '../src/components/mainParser/recoveryParser';

const directoryPath = path.join(__dirname, 'files');

const filesArray = readdirSync(directoryPath);

filesArray.forEach((file) => {
  const content = readFileSync(path.join(directoryPath, file)).toString();
  test(file, () => {
    const result = parse(content, false);
    const { errors } = result;
    expect(errors).toStrictEqual([]);
  });
});
