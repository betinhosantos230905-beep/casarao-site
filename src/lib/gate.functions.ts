import { createServerFn } from "@tanstack/react-start";

// Client-side callers only ever see these three RPC stubs. The server-only
// session module is pulled in with await import() inside each handler body.

export const getAdminState = createServerFn({ method: "GET" }).handler(async () => {
  const { isUnlocked } = await import("./session.server");
  return { unlocked: await isUnlocked() };
});

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const { checkPassword, markUnlocked } = await import("./session.server");
    if (!(await checkPassword(data.password))) return { ok: false as const };
    await markUnlocked();
    return { ok: true as const };
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  const { markLocked } = await import("./session.server");
  await markLocked();
  return { ok: true as const };
});
