/* eslint-disable no-unused-vars */
import { TokenType } from 'chevrotain';

export enum SyntaxCategory {
  Keyword = 1,
  DataType,
  Operator,
}

export type SyntaxToken = {
  name: string;
  pattern: RegExp;
};

const syntaxCategoryMap: Map<SyntaxCategory, SyntaxToken[]> = new Map();

function checkDuplicates(tokenName: string, tokens: SyntaxToken[]): void {
  const tokenNames = tokens.map((token) => token.name);
  const duplicates = tokenNames.filter(
    (name) => tokenNames.filter((name2) => name === name2).length > 1
  );
  if (duplicates.length > 0) {
    throw new Error(`Duplicate token names found: ${duplicates.join(', ')}`);
  }
}

export function categorizeSyntaxToken(
  category: SyntaxCategory,
  token: TokenType
) {
  if (syntaxCategoryMap.has(category)) {
    const tokens = syntaxCategoryMap.get(category);
    if (!tokens) {
      throw new Error(`Category ${category} is not defined`);
    }

    checkDuplicates(token.name, tokens);

    const src = (token.PATTERN as RegExp).source;
    if (src && src === 'NOT_APPLICABLE') {
      throw new Error(`Token ${token.name} has no pattern`);
    }

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
