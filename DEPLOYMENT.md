# Coolify deployment

Connect `OdroLabs/TET_new_web`, branch `main`, through the existing GitHub App. Build with the repository Dockerfile and expose port `3000`.

Set `NEXT_PUBLIC_BACKEND_URL` to the admin HTTPS origin in both build-time and runtime environment variables. Next.js embeds this value during the build, so changing it requires redeploying the website.

Application code is unchanged. The existing `next.config.ts` image and iframe allowlists reference the previous hosting address; adjustments belong to the application maintainer.
