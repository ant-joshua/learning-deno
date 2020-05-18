import { Context } from "https://deno.land/x/oak/mod.ts";

export const logger = async (ctx: Context, next: () => Promise<void>) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
};
