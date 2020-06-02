const path = require('path');
const fs = require('fs');
const chevrotain = require('chevrotain');
const { parserInstance } = require('../chevrotain/rules');

const serializedGrammar = parserInstance.getSerializedGastProductions();

// create the HTML Text
const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar);

// Write the HTML file to disk
const outPath = path.resolve(__dirname, './');
fs.writeFileSync(`${outPath}/index.html`, htmlText);
