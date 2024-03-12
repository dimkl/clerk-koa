import { createClerkClient } from "@clerk/backend";
import type { Middleware } from "koa";
import compose from "koa-compose";

import {
  authenticateRequest,
  setResponseForHandshake,
  setResponseHeaders,
} from "./authenticateRequest";
import { clerkClient as defaultClerkClient } from "./clerkClient";
import type { ClerkMiddleware, ClerkMiddlewareOptions } from "./types";
import { defaultHandler } from "./utils";

const parseHandlerAndOptions = (args: unknown[]) => {
  return [
    typeof args[0] === "function" ? args[0] : undefined,
    (args.length === 2
      ? args[1]
      : typeof args[0] === "function"
      ? {}
      : args[0]) || {},
  ] as [Middleware | undefined, ClerkMiddlewareOptions];
};

export const clerkMiddleware: ClerkMiddleware = (
  ...args: unknown[]
): Middleware => {
  const [handler, options] = parseHandlerAndOptions(args);

  const shouldInitializeClerkClient = Object.keys(options).length > 0;
  const clerkClient = shouldInitializeClerkClient
    ? createClerkClient(options)
    : defaultClerkClient;

  const middleware: Middleware = async (ctx, next) => {
    const requestState = await authenticateRequest({
      clerkClient,
      request: ctx.request,
      options,
    });

    setResponseHeaders(requestState, ctx);
    const handshakeResponseIsSet = setResponseForHandshake(requestState, ctx);
    if (handshakeResponseIsSet) return;

    Object.assign(ctx, { auth: requestState.toAuth() });

    return next();
  };

  return compose([middleware, handler || defaultHandler]);
};
