// https://github.com/clerk/javascript/blob/main/packages/remix/src/errors.ts#L1-L0
const createErrorMessage = (msg: string) => {
  return `🔒 Clerk: ${msg.trim()}
  
  For more info, check out the docs: https://clerk.com/docs,
  or come say hi in our discord server: https://clerk.com/discord
  `;
};

export const middlewareRequired = createErrorMessage(`The "clerkMiddleware" should be registered before using "getAuth".
Example:

import Koa from 'koa';
import { clerkMiddleware } from '@dimkl/clerk-koa';

const app = new Koa();
app.use(clerkMiddleware);
`);

export const satelliteAndMissingProxyUrlAndDomain =
  'Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl';
export const satelliteAndMissingSignInUrl = `
Invalid signInUrl. A satellite application requires a signInUrl for development instances.
Check if signInUrl is missing from your configuration or if it is not an absolute URL.`;
