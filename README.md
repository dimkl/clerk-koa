<p align="center">
  <a href="https://clerk.com?utm_source=github&utm_medium=koa" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://images.clerk.com/static/logo-dark-mode-400x400.png">
      <img src="https://images.clerk.com/static/logo-light-mode-400x400.png" height="64">
    </picture>
  </a>
  <br />
</p>

# @dimkl/clerk-koa

<div align="center">

[![Chat on Discord](https://img.shields.io/discord/856971667393609759.svg?logo=discord)](https://clerk.com/discord)
[![Clerk documentation](https://img.shields.io/badge/documentation-clerk-green.svg)](https://clerk.com/docs?utm_source=github&utm_medium=koa)
[![Follow on Twitter](https://img.shields.io/twitter/follow/ClerkDev?style=social)](https://twitter.com/intent/follow?screen_name=ClerkDev)

[Changelog](https://github.com/dimkl/clerk-koa/blob/main/CHANGELOG.md)
·
[Ask a Question](https://github.com/dimkl/clerk-koa/discussions)

</div>

---

## Overview

[Clerk](https://clerk.com?utm_source=github&utm_medium=koa) is the easiest way to add authentication and user management to your Node.js application. To gain a better understanding of the Clerk Backend API, refer to the <a href="https://clerk.com/docs/reference/backend-api" target="_blank">Backend API</a> documentation.

## Getting started

### Prerequisites

- Node.js `>=18.17.0` or later
- Koa installed (follow their [Getting started](https://koajs.com/) guide)

## Installation

```sh
npm install @dimkl/clerk-koa
```

To build the package locally with the TypeScript compiler, run:

```sh
npm run build
```

## Usage

Retrieve your Backend API key from the [API Keys](https://dashboard.clerk.com/last-active?path=api-keys) screen in your Clerk dashboard and set it as an environment variable in a `.env` file:

```sh
CLERK_PUBLISHABLE_KEY=pk_*******
CLERK_SECRET_KEY=sk_******
```

You will then be able to access all the available methods.

```js
import 'dotenv/config'; // To read CLERK_SECRET_KEY
import { clerkClient } from '@dimkl/clerk-koa';

const { data: userList } = await clerkClient.users.getUserList();
```

You will also be able to secure an Koa app.

````js
import Koa from "koa";
import { clerkMiddleware, getAuth } from "@dimkl/clerk-koa";

const app = new Koa();

app.use(clerkMiddleware());

app.use(async (ctx: KoaContext) => {
  const auth = getAuth(ctx);
  ctx.body = `<body>Hello ${auth?.userId}</body>`;
  ctx.status = 200;
});
app.listen(3000);
```

You will also be able to protect a specific endpoint in a Koa app.

````js
import Koa from "koa";
import Router from "@koa/router";
import { clerkMiddleware, getAuth, requireAuth } from "@dimkl/clerk-koa";

const app = new Koa();

app.use(clerkMiddleware());

router.get("/", (ctx) => {
  ctx.body = `<body> Public Homepage ${auth.userId}</body>`;
  ctx.status = 200;
});

router.get("/protected", requireAuth(), async (ctx: KoaContext) => {
  const auth = getAuth(ctx);
  ctx.body = `<body>Signed-in user "${auth.userId}"</body>`;
  ctx.status = 200;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
```

## Support

You can get in touch with us in any of the following ways:

- Join the official community [Clerk Discord server](https://clerk.com/discord)
- Create a [GitHub Discussion](https://github.com/dimkl/clerk-koa/discussions)
- Contact options listed on [Clerk Support page](https://clerk.com/support?utm_source=github&utm_medium=koa)

## Contributing

We're open to all community contributions!

## Security

`@dimkl/clerk-koa` follows good practices of security, but 100% security cannot be assured.

`@dimkl/clerk-koa` is provided **"as is"** without any **warranty**. Use at your own risk.

_For more information and to report security issues, please refer to the [security documentation](https://github.com/dimkl/clerk-koa/blob/main/docs/SECURITY.md)._

## License

This project is licensed under the **MIT license**.

See [LICENSE](https://github.com/dimkl/clerk-koa/blob/main/LICENSE) for more information.
