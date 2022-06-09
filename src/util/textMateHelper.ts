import {
  getSyntaxCategoryMap,
  SyntaxCategory,
} from '../components/tokenDictionary/syntaxHelper';
import parse from '../components/mainParser/recoveryParser';

parse('begin null; end;', true);

function wrap(pattern: string) {
  return `\\\\b${pattern}\\\\b`;
}

const map = getSyntaxCategoryMap();
for (const [key, value] of map.entries()) {
  const patterns = value.map((item) => {
    // console.log(`${item.name}: ${item.pattern.source}`);

    return item.pattern.source?.replace(/\\/g, '\\\\'); // funny but this works
  });
  const patternString = `(${patterns.join('|')})`;

  switch (key) {
    case SyntaxCategory.DataType:
      console.log('DataType', wrap(patternString));
      break;
    case SyntaxCategory.Operator:
      console.log('Operator', patternString);
      break;
  }
}

// console.log('wat', map.get(SyntaxCategory.DataType));
// for (const key in Object.keys(map)) {
//   console.log('key', key);
// }
