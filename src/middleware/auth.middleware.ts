import { Context, validateJwt } from "../../deps.ts";
import { getUserByUsername } from "../models/user.ts";
const key = "emangmantul123";
export const auth = async (ctx: Context, next: () => Promise<void>) => {
  ctx.response.headers.set("Content-Type", "application/json");
  // Get Authorization Header
  const authorization = ctx.request.headers.get("Authorization");
  // Get Token in Authorization Header
  const jwt = authorization!.replace("Bearer ", "");
  // Validate JWT Token
  const tokenValid = await validateJwt(jwt, key, { isThrowing: false });
  if (tokenValid) {
    // Get Payload From Token
    let { payload } = tokenValid;
    // Set Current User in State
    ctx.state.currentUser = await getUserByUsername(payload?.iss);
    await next();
    return;
  }
  // Set Response to Unauthorized
  ctx.response.status = 401;
  ctx.response.body = { error: "Not authorized" };
};
