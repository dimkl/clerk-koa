import type { RequestState } from "@clerk/backend/internal";
import { AuthStatus, createClerkRequest } from "@clerk/backend/internal";
import { handleValueOrFn } from "@clerk/shared/handleValueOrFn";
import { isDevelopmentFromSecretKey } from "@clerk/shared/keys";
import {
  isHttpOrHttps,
  isProxyUrlRelative,
  isValidProxyUrl,
} from "@clerk/shared/proxy";
import type { Request as KoaRequest, Context as KoaContext } from "koa";

import {
  satelliteAndMissingProxyUrlAndDomain,
  satelliteAndMissingSignInUrl,
} from "./errors";
import type { AuthenticateRequestParams } from "./types";
import { loadApiEnv, loadClientEnv } from "./utils";

export const authenticateRequest = (opts: AuthenticateRequestParams) => {
  const { clerkClient, request, options } = opts;
  const { jwtKey, authorizedParties, audience } = options || {};

  const clerkRequest = createClerkRequest(incomingMessageToRequest(request));
  const env = { ...loadApiEnv(), ...loadClientEnv() };

  const secretKey = options?.secretKey || env.secretKey;
  const publishableKey = options?.publishableKey || env.publishableKey;

  const isSatellite = handleValueOrFn(
    options?.isSatellite,
    clerkRequest.clerkUrl,
    env.isSatellite
  );
  const domain =
    handleValueOrFn(options?.domain, clerkRequest.clerkUrl) || env.domain;
  const signInUrl = options?.signInUrl || env.signInUrl;
  const proxyUrl = absoluteProxyUrl(
    handleValueOrFn(options?.proxyUrl, clerkRequest.clerkUrl, env.proxyUrl),
    clerkRequest.clerkUrl.toString()
  );

  if (isSatellite && !proxyUrl && !domain) {
    throw new Error(satelliteAndMissingProxyUrlAndDomain);
  }

  if (
    isSatellite &&
    !isHttpOrHttps(signInUrl) &&
    isDevelopmentFromSecretKey(secretKey || "")
  ) {
    throw new Error(satelliteAndMissingSignInUrl);
  }

  return clerkClient.authenticateRequest(clerkRequest, {
    audience,
    secretKey,
    publishableKey,
    jwtKey,
    authorizedParties,
    proxyUrl,
    isSatellite,
    domain,
    signInUrl,
  });
};

const incomingMessageToRequest = (req: KoaRequest): Request => {
  const headers = Object.keys(req.headers).reduce(
    (acc, key) => Object.assign(acc, { [key]: req?.headers[key] }),
    {}
  );
  const dummyOriginReqUrl = new URL(
    req.url || "",
    `${req.protocol}://clerk-dummy`
  );
  return new Request(dummyOriginReqUrl, {
    method: req.method,
    headers: new Headers(headers),
  });
};

export const setResponseHeaders = (
  requestState: RequestState,
  ctx: KoaContext
) => {
  if (!requestState.headers) return;

  requestState.headers.forEach((value, key) => ctx.append(key, value));
};

/**
 * Depending on the auth state of the request, handles applying redirects and validating that a handshake state was properly handled.
 *
 * Returns an error if state is handshake without a redirect, otherwise returns true/false whether the handshake response is being set.
 */
export const setResponseForHandshake = (
  requestState: RequestState,
  ctx: KoaContext
): boolean | never => {
  const hasLocationHeader = requestState.headers.get("location");
  // triggering a handshake redirect
  if (hasLocationHeader) {
    ctx.status = 307;
    return true;
  }

  if (requestState.status === AuthStatus.Handshake) {
    throw new Error("Clerk: unexpected handshake without redirect");
  }

  return false;
};

const absoluteProxyUrl = (
  relativeOrAbsoluteUrl: string,
  baseUrl: string
): string => {
  if (
    !relativeOrAbsoluteUrl ||
    !isValidProxyUrl(relativeOrAbsoluteUrl) ||
    !isProxyUrlRelative(relativeOrAbsoluteUrl)
  ) {
    return relativeOrAbsoluteUrl;
  }
  return new URL(relativeOrAbsoluteUrl, baseUrl).toString();
};
