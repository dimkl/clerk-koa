import type { Middleware } from 'koa';

import { getAuth } from './getAuth';

/**
 * Middleware to protect requests for user authenticated or authorized requests.
 * An HTTP 401 status code is returned for unauthenticated requests.
 *
 * @example
 * router.get('/path', requireAuth, getHandler)
 * @example Support authorization checks
 * hasPermission = (ctx, next) => {
 *   const auth = getAuth(request);
 *   if (!auth.has('perm')) {
 *     ctx.status = 403;
 *     return;
 *   }
 *   return next();
 * }
 * router.get('/path', compose([requireAuth, hasPermission]), getHandler)
 *
 * @throws {Error} `clerkMiddleware` is required to be set in the middleware chain before this util is used.
 */
export const requireAuth: Middleware = (ctx, next) => {
  if (!getAuth(ctx).userId) {
    ctx.status = 401;
    return;
  }

  return next();
};
