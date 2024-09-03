import { clerkClient } from "../clerkClient";

describe("clerkClient", () => {
  describe("missing envs", () => {
    const secretKey = process.env.CLERK_SECRET_KEY;
    const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;

    beforeEach(() => {
      process.env.CLERK_SECRET_KEY = "";
      process.env.CLERK_PUBLISHABLE_KEY = "";

      jest.spyOn(console, 'error')
      // @ts-expect-error jest.spyOn adds this functionallity
      console.error.mockImplementation(() => null);
    });

    afterEach(() => {
      process.env.CLERK_SECRET_KEY = secretKey;
      process.env.CLERK_PUBLISHABLE_KEY = publishableKey;

      // @ts-expect-error jest.spyOn adds this functionallity
      console.error.mockRestore()
    });

    // Add all assertions in the same test since it's not easy to clear the singleton instance
    it("throws error on missing envs or triggers methods from singleton instance ", async () => {
      await expect(clerkClient.users.getCount()).rejects.toMatchObject({
        message:
          "Missing Clerk Secret Key. Go to https://dashboard.clerk.com and get your key for your instance.",
      });
      process.env.CLERK_SECRET_KEY = secretKey;

      await expect(
        clerkClient.authenticateRequest(new Request("http://example.com"))
      ).rejects.toMatchObject({
        message: "Publishable key not valid.",
      });

      await expect(
        clerkClient.authenticateRequest(new Request("http://example.com"), {
          publishableKey: "pk_test_VEVTVF9QVUJMSVNIQUJMRV9LRVkk",
        })
      ).resolves.toMatchObject({
        status: "signed-out",
        message: "",
        isSignedIn: false,
      });
    });
  });
});
