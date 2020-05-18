import { Application } from "./deps.ts";

// Router
import router from "./src/router/router.ts";
import authRouter from "./src/router/authRouter.ts";
// Middleware
import { auth } from "./src/middleware/auth.middleware.ts";
import { logger } from "./src/middleware/logger.middleware.ts";
import { timing } from "./src/middleware/timing.middleware.ts";
import { cors, CORSConfig } from "./src/middleware/cors.middleware.ts";

const app = new Application();
// Cors Configuration
const config: CORSConfig = {
  allowOrigins: ["*"],
  // allowMethods: ["GET","POST","PUT"],
};

app.use(logger);
app.use(timing);
app.use(cors(config));

app.use(router.routes());
app.use(router.allowedMethods());

// authorization middleware
app.use(auth);
// Protected Routes
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

await app.listen({ port: 8000 });
