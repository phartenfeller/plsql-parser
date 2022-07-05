type IdentifierArray = {
  value: string;
  startPos: number;
};

function recusiveGetToken(ctx: any | any[]) {
  if (!ctx) {
    throw new Error(`No ctx passed`);
  }

  const values: IdentifierArray[] = [];

  let ctxTokens: any[] = [];

  if (Array.isArray(ctx)) {
    ctxTokens = ctx;
  } else {
    ctxTokens = [ctx];
  }

  ctxTokens.forEach((c) => {
    if (c.image) {
      values.push({
        value: c.image,
        startPos: c.startOffset ?? c.location.startOffset,
      });
    } else if (c.children) {
      values.push(...recusiveGetToken(c.children));
    } else {
      const keys = Object.keys(c);

      keys.forEach((k) => {
        if (c[k] && Array.isArray(c[k])) {
          c[k].forEach((v: any) => {
            if (v.image) {
              values.push({
                value: v.image,
                startPos: v.startOffset ?? v.location.startOffset,
              });
            } else if (v.children) {
              values.push(...recusiveGetToken(v.children));
            } else {
              console.log(`[recusiveGetToken] why no image here?`, v);
            }
          });
        } else {
          console.log(`[recusiveGetToken] why is this not an array?`, k);
        }
      });
    }
  });

  return values;
}

export default function recusiveGetTokenString(ctx: any | any[]) {
  const values = recusiveGetToken(ctx);
  const sorted = values.sort((a, b) => a.startPos - b.startPos);
  return sorted.map((v) => v.value).join('');
}
