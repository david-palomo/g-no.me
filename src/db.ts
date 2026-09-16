import { LIBSQL_AUTH_TOKEN, LIBSQL_URL } from "astro:env/server";

// Both of these are the `web` entrypoints on purpose: they talk HTTP and are
// pure JS. The default entrypoints pull in a native binary that Vercel's
// bundler does not trace into the function, which crashes it at import time.
import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql/web";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ShortUrl = sqliteTable("ShortUrl", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	url: text("url").notNull(),
});

const client = createClient({
	url: LIBSQL_URL,
	authToken: LIBSQL_AUTH_TOKEN,
});

export const db = drizzle(client);

/**
 * One table with two columns doesn't earn a migration tool, so create it on
 * first use. The promise is memoized, so this costs one statement per process
 * rather than one per request.
 */
let ready: Promise<unknown> | undefined;

export function dbReady() {
	ready ??= client
		.execute(
			`CREATE TABLE IF NOT EXISTS ShortUrl (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				url TEXT NOT NULL
			)`,
		)
		.catch((error) => {
			ready = undefined; // a failure here shouldn't poison the whole process
			throw error;
		});
	return ready;
}
