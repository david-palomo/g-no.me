# g-no.me

An URL shortener with a twist.

## Setup

The app stores links in a [libSQL](https://github.com/tursodatabase/libsql)
database and needs a connection URL to start. Copy `.env.example` to `.env` and
fill it in with either of these:

**Turso** (free tier, what production uses):

```bash
turso db create gnome
turso db show gnome --url          # -> LIBSQL_URL
turso db tokens create gnome       # -> LIBSQL_AUTH_TOKEN
```

**Local, no account** — run a libSQL server in Docker and point `LIBSQL_URL` at
`http://localhost:8080` (no token needed):

```bash
docker run -p 8080:8080 ghcr.io/tursodatabase/libsql-server
```

Then:

```bash
pnpm install
pnpm dev
```

The `ShortUrl` table is created on first use, so there's no migration step.

## Deploying

Set `LIBSQL_URL` and `LIBSQL_AUTH_TOKEN` in the Vercel project's environment
variables. They're read at runtime, so changing them only needs a redeploy, not
a rebuild.

## TODO

- [ ] Pretty much everything
