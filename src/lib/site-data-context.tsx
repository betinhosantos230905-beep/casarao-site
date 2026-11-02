import { createContext, useContext } from "react";
import type { SiteData } from "@/lib/site.functions";

export const SiteDataContext = createContext<SiteData | null>(null);

/**
 * The site's photos, menu and details. The root route loads them once and
 * every page reads them from here, so the HTML the server sent and the first
 * render in the browser always show the same thing.
 */
export function useSiteData(): SiteData {
  return useContext(SiteDataContext) ?? { info: null, media: [], items: [] };
}
