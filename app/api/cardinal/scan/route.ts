import { createCardinalDrafts } from "@/lib/cardinal-agent";
import { getCardinalRecheckQueue } from "@/lib/supabase";

function isAuthorized(request: Request) {
  const secret = process.env.CARDINAL_CRON_SECRET;
  const authorization = request.headers.get("authorization");
  return !secret || authorization === `Bearer ${secret}`;
}

function splitEnvList(value?: string) {
  return value
    ?.split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ ok: false, message: "Cardinal bloqueado." }, { status: 401 });
  }

  const seedLinks = splitEnvList(process.env.CARDINAL_SEED_LINKS);
  const seedNames = splitEnvList(process.env.CARDINAL_SEED_NAMES);
  const queue = await getCardinalRecheckQueue();
  const indexed = new Map<string, string>();
  seedLinks.forEach((link, index) => indexed.set(link, seedNames[index] ?? ""));
  queue.forEach((item) => indexed.set(item.link, item.name));
  const links = [...indexed.keys()];
  const names = [...indexed.values()];
  const result = await createCardinalDrafts({ links, names });
  return Response.json({ ok: true, scheduled: true, ...result });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ ok: false, message: "Cardinal bloqueado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const links = Array.isArray(body?.links) ? body.links.filter((link: unknown) => typeof link === "string") : [];
  const names = Array.isArray(body?.names) ? body.names.filter((name: unknown) => typeof name === "string") : [];
  const result = await createCardinalDrafts({ links, names });
  return Response.json({ ok: true, ...result });
}
