import { defineConfig, envField } from 'astro/config';

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  security: {
    // Astro ignores X-Forwarded-Host unless the host is declared trusted, and
    // falls back to "localhost". Astro.url.origin then never matches the
    // browser's Origin header, so its CSRF check rejects every form POST with
    // "Cross-site POST form submissions are forbidden".
    allowedDomains: [
      { hostname: "g-no.me", protocol: "https" },
      { hostname: "**.g-no.me", protocol: "https" },
      // Vercel preview deployments get a generated subdomain each time.
      { hostname: "**.vercel.app", protocol: "https" },
    ],
  },
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
