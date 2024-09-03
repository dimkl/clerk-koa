// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { createClerkClient } from '@clerk/backend';
import type { AuthObject } from '@clerk/backend';
import type { AuthenticateRequestOptions } from '@clerk/backend/internal';
import type { Request as KoaRequest, Context, Middleware } from 'koa';

export type KoaContextWithAuth = Context & { auth: AuthObject };

export type ClerkMiddlewareOptions = AuthenticateRequestOptions & { debug?: boolean };

/**
 * Middleware for Express that handles authentication and authorization with Clerk.
 * For more details, please refer to the docs: https://beta.clerk.com/docs/backend-requests/handling/express
 */
export interface ClerkMiddleware {
  /**
   * @example
   * app.use(clerkMiddleware((ctx, next) => { ... }, options));
   */
  (handler: Middleware, options?: ClerkMiddlewareOptions): Middleware;
  /**
   * @example
   * app.use(clerkMiddleware(options));
   *
   * @example
   * app.use(clerkMiddleware());
   */
  (options?: ClerkMiddlewareOptions): Middleware;
}

type ClerkClient = ReturnType<typeof createClerkClient>;
export type AuthenticateRequestParams = {
  clerkClient: ClerkClient;
  request: KoaRequest;
  options?: ClerkMiddlewareOptions;
};
