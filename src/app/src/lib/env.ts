/**
 * Startup environment validation.
 *
 * Throws a descriptive error naming the missing variable so the app
 * fails fast at boot instead of failing later with an opaque DB error.
 */

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Set ${name} in your environment (see .env.example) before starting the app.`
    );
  }
  return value;
}

export function getDatabaseUrl(): string {
  return requireEnv("DATABASE_URL");
}
