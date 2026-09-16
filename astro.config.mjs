import { defineConfig, envField } from 'astro/config';

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  env: {
    schema: {
      // Declared as secrets so Astro reads them at runtime. Public vars get
      // inlined into the bundle at build time, which would bake in whatever
      // the build machine had (i.e. nothing) and ignore Vercel's env vars.
      LIBSQL_URL: envField.string({ context: "server", access: "secret" }),
      LIBSQL_AUTH_TOKEN: envField.string({
        context: "server",
        access: "secret",
        // A local libsql-server runs without auth; Turso always needs a token.
        optional: true,
      }),
    },
  },
});
