<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- The admin area is gated by one shared password (`SITE_PASSWORD`) stored in an encrypted session cookie, not by individual accounts — the restaurant owner hands the password to whoever should see the panel. Keep the comparison timing-safe and server-side.
- Server-only code (`useSession`, the service-role client, `process.env` reads) lives in `*.server.ts` modules and is loaded with `await import()` inside handler bodies, so it never reaches the browser bundle.
- Uploaded photos go to the private `site-media` bucket and are served to the page through `/api/public/media/$`; public buckets are blocked in this workspace, so do not try to make one public.
- Public pages read menu, photos and restaurant data through the `getSiteData` server function (publishable client, narrow anon SELECT policies) so the pages still have content before JavaScript runs.
- That data is loaded once by the root route's loader and shared through `SiteDataContext` (`useSiteData()`); admin pages read their own loader result with `Route.useLoaderData()` and refresh with `router.invalidate()`. Do not fetch route data with `useQuery` in components — the query cache is not carried to the browser, so the server HTML and the first client render disagree and React throws a hydration error.
- `/admin` is the login screen and `/admin/reservas|cardapio|fotos|info` are the panel; the `/admin` index only redirects when the session is already unlocked, otherwise the two guards bounce each other forever.
