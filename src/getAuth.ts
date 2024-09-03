import type { AuthObject } from '@clerk/backend';
import type { Context as KoaContext } from 'koa';

import { middlewareRequired } from './errors';
import { isAuthInRequest } from './utils';

/**
 * Retrieves the Clerk AuthObject using the current request object.
 *
 * @param {ExpressRequest} ctx - The current context object.
 * @returns {AuthObject} Object with information about the request state and claims.
 * @throws {Error} `clerkMiddleware` is required to be set in the middleware chain before this util is used.
 */
export const getAuth = (ctx: KoaContext): AuthObject => {
  if (!isAuthInRequest(ctx)) {
    throw new Error(middlewareRequired);
  }

  return ctx.auth;
};
