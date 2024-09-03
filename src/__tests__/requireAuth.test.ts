import type { Context as KoaContext } from "koa";

import { requireAuth } from "../requireAuth";
import { middlewareRequired } from "../errors";

describe("requireAuth", () => {
    it("should throw middleware required error if clerkMiddleware is not set", () => {
      const ctx = {} as KoaContext;
      const nextFn = jest.fn();
      expect(() => requireAuth(ctx, nextFn)).toThrow(middlewareRequired);
    });

    it("should return http 401 if request is not authenticated", () => {
      const ctx = { auth: { userId: null } } as unknown as KoaContext;
      const nextFn = jest.fn();
      requireAuth(ctx, nextFn);

      expect(ctx.status).toEqual(401);
      expect(nextFn).not.toHaveBeenCalled();
    });

    it("should continue with next middleware if request is authenticated", () => {
      const ctx = { auth: { userId: "user_..." } } as unknown as KoaContext;
      const nextFn = jest.fn();
      requireAuth(ctx, nextFn);

      expect(ctx.status).toBeUndefined();
      expect(nextFn).toHaveBeenCalled();
    });
});
