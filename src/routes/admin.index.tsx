import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAdminState } from "@/lib/gate.functions";

export const Route = createFileRoute("/admin/")({
  // Only bounce to the panel when the password has already been given.
  // Redirecting unconditionally would loop: the panel sends locked
  // visitors back here, and here would send them straight back there.
  loader: async () => {
    const { unlocked } = await getAdminState();
    if (unlocked) throw redirect({ to: "/admin/reservas" });
    return { unlocked };
  },
  component: () => null,
});
