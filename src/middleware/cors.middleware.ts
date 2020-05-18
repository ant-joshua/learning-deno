import { Context } from "https://deno.land/x/oak/mod.ts";

export const DefaultCORSConfig: CORSConfig = {
  // skipper: DefaultSkipper,
  allowOrigins: ["*"],
  allowMethods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
  // allowMethods: [
  //   HttpMethod.Delete,
  //   HttpMethod.Get,
  //   HttpMethod.Head,
  //   HttpMethod.Patch,
  //   HttpMethod.Post,
  //   HttpMethod.Put,
  // ],
};

export const cors = (config: CORSConfig) =>
  async (ctx: Context, next: () => Promise<void>) => {
    // console.log(role);

    if (!config.allowOrigins || config.allowOrigins.length == 0) {
      config.allowOrigins = DefaultCORSConfig.allowOrigins;
    }
    if (!config.allowMethods || config.allowMethods.length == 0) {
      config.allowMethods = DefaultCORSConfig.allowMethods;
    }

    const request = ctx.request;
    const response = ctx.response;
    const origin = request.headers!.get("Origin")!;

    if (!response.headers) response.headers = new Headers();

    let allowOrigin = "";
    for (const o of config.allowOrigins!) {
      if (o == "*" && config.allowCredentials) {
        allowOrigin = origin;
        break;
      }
      if (o == "*" || o == origin) {
        allowOrigin = o;
        break;
      }
      if (origin.startsWith(o)) {
        allowOrigin = origin;
        break;
      }
    }
    // Vary Origin
    response.headers.append("Vary", "Origin");
    if (config.allowCredentials) {
      response.headers.set("Access-Control-Allow-Credentials", "true");
      // response.headers.set("Access-Control-Allow-Origin", "true");
    }

    if (request.method != "OPTIONS") {
      response.headers.set("Access-Control-Allow-Origin", allowOrigin);
      if (config.exposeHeaders && config.exposeHeaders.length != 0) {
        response.headers.set(
          "Access-Control-Expose-Headers",
          config.exposeHeaders.join(","),
        );
      }
      return await next();
    }

    response.headers.append("Vary", "Access-Control-Allow-Methods");
    response.headers.append("Vary", "Access-Control-Allow-Headers");
    response.headers.set("Access-Control-Allow-Origin", allowOrigin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      config.allowMethods!.join(","),
    );
    if (config.allowHeaders && config.allowHeaders.length != 0) {
      response.headers.set(
        "Access-Control-Request-Headers",
        config.allowHeaders.join(","),
      );
    } else {
      const h = request.headers.get("Access-Control-Request-Headers");
      if (h) {
        response.headers.set("Access-Control-Request-Headers", h);
      }
    }
    if (config.maxAge! > 0) {
      response.headers.set("Access-Control-Max-Age", String(config.maxAge));
    }
    response.status = 204;

    return await next();
  };

export interface CORSConfig {
  // skipper?: Skipper;
  allowOrigins?: string[];
  allowMethods?: string[];
  allowHeaders?: string[];
  allowCredentials?: boolean;
  exposeHeaders?: string[];
  maxAge?: number;
}
