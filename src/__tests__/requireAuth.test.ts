import type { Context as KoaContext } from "koa";

import { requireAuth } from "../requireAuth";
import { defaultHandler } from "../utils";
import { middlewareRequired } from "../errors";

describe("requireAuth", () => {
  describe("using defaultHandler", () => {
    it("should throw middleware required error if clerkMiddleware is not set", () => {
      const [middleware] = requireAuth();

      const ctx = {} as KoaContext;
      const nextFn = jest.fn();
      expect(() => middleware(ctx, nextFn)).toThrow(middlewareRequired);
    });

    it("should return http 401 if request is not authenticated", () => {
      const [middleware, handler] = requireAuth();

      const ctx = { auth: { userId: null } } as unknown as KoaContext;
      const nextFn = jest.fn();
      middleware(ctx, nextFn);

      expect(ctx.status).toEqual(401);
      expect(nextFn).not.toHaveBeenCalled();
      expect(handler).toEqual(defaultHandler);
    });

    it("should continue with next middleware if request is authenticated", () => {
      const [middleware, handler] = requireAuth();

      const ctx = { auth: { userId: "user_..." } } as unknown as KoaContext;
      const nextFn = jest.fn();
      middleware(ctx, nextFn);

      expect(ctx.status).toBeUndefined();
      expect(nextFn).toHaveBeenCalled();
      expect(handler).toEqual(defaultHandler);
    });
  });

  describe("using handler", () => {
    it("should throw middleware required error if clerkMiddleware is not set", () => {
      const handler = jest.fn();
      const [middleware] = requireAuth(handler);

      const ctx = {} as KoaContext;
      const nextFn = jest.fn();
      expect(() => middleware(ctx, nextFn)).toThrow(middlewareRequired);
    });

    it("should return http 401 if request is not authenticated", () => {
      const handler = jest.fn();
      const [middleware, authHandler] = requireAuth(handler);

      const ctx = { auth: { userId: null } } as unknown as KoaContext;
      const nextFn = jest.fn();
      middleware(ctx, nextFn);

      expect(ctx.status).toEqual(401);
      expect(nextFn).not.toHaveBeenCalled();
      expect(authHandler).toEqual(handler);
    });

    it("should continue with next middleware if request is authenticated", () => {
      const handler = jest.fn();
      const [middleware, authHandler] = requireAuth(handler);

      const ctx = { auth: { userId: "user_..." } } as unknown as KoaContext;
      const nextFn = jest.fn();
      middleware(ctx, nextFn);

      expect(ctx.status).toBeUndefined();
      expect(nextFn).toHaveBeenCalled();
      expect(authHandler).toEqual(handler);
    });
  });
});
