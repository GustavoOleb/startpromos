import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "sp_admin_session";

const ONE_DAY_SECONDS = 60 * 60 * 24;
export const ADMIN_SESSION_SECONDS = ONE_DAY_SECONDS * 7;

function adminSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "startpromos-dev-secret";
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "startpromos-admin",
  };
}

export function createAdminSessionToken(username = getAdminCredentials().username) {
  return createHash("sha256").update(`${username}:${adminSecret()}:startpromos-cardinal`).digest("hex");
}

export function isValidAdminSessionToken(value?: string | null) {
  if (!value) return false;
  const expected = createAdminSessionToken();
  const givenBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  if (givenBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(givenBuffer, expectedBuffer);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  };
}
