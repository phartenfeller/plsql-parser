const fs = require('fs');

const readFile = async (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(data.toString());
    });
  });

module.exports = readFile;
