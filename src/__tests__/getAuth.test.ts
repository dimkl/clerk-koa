import type { Context as KoaContext } from "koa";
import type { AuthObject } from "@clerk/backend";

import { getAuth } from "../getAuth";
import type { KoaContextWithAuth } from "../types";
import { middlewareRequired } from "../errors";

describe("getAuth", () => {
  it("should throw error when middleware is not initialized", () => {
    expect(() => getAuth({} as KoaContext)).toThrow(middlewareRequired);
  });

  it("should return auth when middleware is initialized", () => {
    const auth = { userId: "sess_...." } as unknown as AuthObject;
    expect(getAuth({ auth } as KoaContextWithAuth)).toMatchObject(auth);
  });
});
