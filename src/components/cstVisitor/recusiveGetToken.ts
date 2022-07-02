export function recusiveGetToken(ctx: any | any[]) {
  if (!ctx) {
    throw new Error(`No ctx passed`);
  }

  const values: string[] = [];

  let ctxTokens: any[] = [];

  if (Array.isArray(ctx)) {
    ctxTokens = ctx;
  } else {
    ctxTokens = [ctx];
  }

  ctxTokens.forEach((c) => {
    if (c.image) {
      values.push(c.image);
    } else if (c.children) {
      values.push(...recusiveGetToken(c.children));
    } else {
      const keys = Object.keys(c);

      keys.forEach((k) => {
        if (c[k] && Array.isArray(c[k])) {
          c[k].forEach((v: any) => {
            if (v.image) {
              values.push(v.image);
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

export function recusiveGetTokenString(ctx: any | any[]) {
  const values = recusiveGetToken(ctx);
  return values.join(' ');
}
