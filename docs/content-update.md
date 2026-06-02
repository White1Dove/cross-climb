# Content Update Pipeline

The site is a static Next export deployed by GitHub Actions to Cloudflare Pages. That means page content must exist in the repository before `pnpm run build` runs.

Automatic publishing is documented in `docs/auto-publish.md`. The manual flow below is still useful when the Worker or GitHub dispatch path is unavailable.

For the current local-only plugin flow:

1. Export the saved Crossclimb or Pinpoint log from the extension logs page.
2. Run `pnpm import:puzzle-log ~/Downloads/linkedin-game-YYYY-MM-DD.json`.
3. Run `pnpm run build`.
4. Commit and push the changed files in `data/`.

The existing `.github/workflows/deploy.yml` deploys the rebuilt `out/` directory to Cloudflare Pages after the push.

The import script also accepts copied JSON via stdin:

```sh
pbpaste | pnpm import:puzzle-log -
```

Do not paste GitHub or Cloudflare tokens into the browser extension. If publishing should become fully automatic, put the authenticated write path behind a Cloudflare Worker or GitHub Actions dispatch endpoint.
