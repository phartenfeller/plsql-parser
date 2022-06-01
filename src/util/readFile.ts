import * as fs from 'fs';

const readFile = async (path: string) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(data.toString());
    });
  });

export default readFile;
