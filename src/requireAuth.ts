import type { Middleware } from 'koa';
import compose from "koa-compose";

import { getAuth } from './getAuth';
import { defaultHandler } from './utils';

/**
 * Middleware to protect requests for user authenticated or authorized requests.
 * An HTTP 401 status code is returned for unauthenticated requests and it can receive
 * a RequestHandler argument to support authorization checks (as shown in the 2nd example).
 *
 * @example
 * router.get('/path', requireAuth(), getHandler)
 * @example
 * hasPermission = (ctx, next) => {
    const auth = getAuth(request);
    if (!auth.has('perm')) {
      ctx.status = 403;
      return;
    }
    return next();
  }
 * router.get('/path', requireAuth(hasPermission), getHandler)
 *
 * @throws {Error} `clerkMiddleware` is required to be set in the middleware chain before this util is used.
 */
export const requireAuth = (handler?: Middleware): Middleware => {
  const middleware: Middleware = (ctx, next) => {
    if (!getAuth(ctx).userId) {
      ctx.status = 401;
      return;
    }

    return next();
  };

  return compose([middleware, handler || defaultHandler]);
};
