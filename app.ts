import { Application } from "https://deno.land/x/oak/mod.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts"
import router from "./router.ts";
import authRouter from './authRouter.ts';
import { getUserByUsername } from './src/models/user.ts';

const app = new Application();


app.use(router.routes());
app.use(router.allowedMethods())

const key = "emangmantul123"
// authorization middleware
app.use(async (ctx, next) => {
    ctx.response.headers.set("Content-Type",'application/json');
    const authorization = ctx.request.headers.get("Authorization");
    const jwt = authorization?.replace("Bearer ", "") ?? '';
    const tokenValid = await validateJwt(jwt, key, { isThrowing: false });
    // console.log(tokenValid);
    if (tokenValid) {
      let {payload} = tokenValid
      ctx.state.currentUser =  await getUserByUsername(payload?.iss)
      await next();
      return;
    }
    
    ctx.response.body = JSON.stringify({ error: "Not authorized" });
});
// Protected Routes
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());




await app.listen({ port: 8000 });

// const mainRouter = new Router();

// app.use(mainRouter.routes());
