import { createFileRoute } from "@tanstack/react-router";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const Route = createFileRoute("/api/public/admin-media")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // This prefix bypasses site auth, so the handler verifies the caller itself.
        const { isUnlocked } = await import("@/lib/session.server");
        if (!(await isUnlocked())) {
          return Response.json({ ok: false, error: "Você precisa entrar primeiro." }, { status: 401 });
        }

        const form = await request.formData();
        const file = form.get("file");
        const key = String(form.get("key") || "");

        if (!/^[\w-]{1,60}$/.test(key)) {
          return Response.json({ ok: false, error: "Identificador da foto inválido." }, { status: 400 });
        }
        if (!(file instanceof File)) {
          return Response.json({ ok: false, error: "Nenhum arquivo enviado." }, { status: 400 });
        }
        const ext = ALLOWED[file.type];
        if (!ext) {
          return Response.json({ ok: false, error: "Envie uma imagem JPG, PNG ou WebP." }, { status: 400 });
        }
        if (file.size > MAX_BYTES) {
          return Response.json({ ok: false, error: "A imagem precisa ter no máximo 10 MB." }, { status: 400 });
        }

        const path = `${key}-${Date.now()}.${ext}`;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.storage
          .from("site-media")
          .upload(path, file, { contentType: file.type, upsert: true });

        if (error) {
          return Response.json({ ok: false, error: "Não foi possível guardar a imagem." }, { status: 500 });
        }

        return Response.json({ ok: true, url: `/api/public/media/${path}` });
      },
    },
  },
});
