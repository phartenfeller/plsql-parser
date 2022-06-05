/* eslint-disable no-unused-vars */
import { TokenType } from 'chevrotain';

export enum SyntaxCategory {
  Keyword = 1,
  DataType,
}

export type SyntaxToken = {
  name: string;
  pattern: RegExp;
};

const syntaxCategoryMap: Map<SyntaxCategory, SyntaxToken[]> = new Map();

export function categorizeSyntaxToken(
  category: SyntaxCategory,
  token: TokenType
) {
  console.log('add', token.name);
  if (syntaxCategoryMap.has(category)) {
    const tokens = syntaxCategoryMap.get(category);
    if (!tokens) {
      throw new Error(`Category ${category} is not defined`);
    }
    console.log('tokens', tokens.length);
    tokens.push({ name: token.name, pattern: token.PATTERN as RegExp });
    syntaxCategoryMap.set(category, tokens);
  } else {
    syntaxCategoryMap.set(category, [
      {
        name: token.name,
        pattern: token.PATTERN as RegExp,
      },
    ]);
  }
}

export function getSyntaxCategoryMap() {
  return syntaxCategoryMap;
}
