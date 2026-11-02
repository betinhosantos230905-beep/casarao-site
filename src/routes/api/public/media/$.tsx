import { createFileRoute } from "@tanstack/react-router";

const PUBLIC_PREFIX = "/api/public/media/";

function typeFor(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "svg") return "image/svg+xml";
  return "image/jpeg";
}

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const raw = new URL(request.url).pathname.slice(PUBLIC_PREFIX.length);
        const path = decodeURIComponent(raw);
        if (!path || path.includes("..") || path.includes("\\")) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("site-media").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(data, {
          headers: {
            "content-type": data.type || typeFor(path),
            "cache-control": "public, max-age=604800",
          },
        });
      },
    },
  },
});
