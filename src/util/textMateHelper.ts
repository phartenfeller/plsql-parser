import {
  getSyntaxCategoryMap,
  SyntaxCategory,
} from '../components/tokenDictionary/syntaxHelper';
import parse from '../components/mainParser/recoveryParser';

parse('begin null; end;', true);

const map = getSyntaxCategoryMap();
for (const [key, value] of map.entries()) {
  const patterns = value.map((item) => item.pattern.source);
  const patternString = `\\\\b(${patterns.join('|')})\\\\b`;

  switch (key) {
    case SyntaxCategory.DataType:
      console.log('DataType', patternString);
  }
}

// console.log('wat', map.get(SyntaxCategory.DataType));
// for (const key in Object.keys(map)) {
//   console.log('key', key);
// }
