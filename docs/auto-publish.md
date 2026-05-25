# Auto Publish Setup

Automatic publishing uses this chain:

Chrome extension -> Cloudflare Worker `/publish` -> GitHub `repository_dispatch` -> `publish-crossclimb-log.yml` -> commit `data/*.json` -> deploy Cloudflare Pages.

The extension stores only a low-privilege publish secret. The GitHub token stays in Cloudflare Worker secrets.
The Worker strips raw page payloads before dispatching to GitHub so only publishable puzzle fields are sent.

## One-time setup

1. Create a GitHub fine-grained personal access token for `White1Dove/cross-climb`.
   It needs `Contents: Read and write` for this repo so it can call the repository dispatch API.
2. Create a long random publish secret.
3. Push this code to `main` first. GitHub only runs `repository_dispatch` workflows that already exist on the default branch.
4. Store both secrets on the Worker:

```sh
cd /Users/liangkaixiang/Documents/cross-climb
npx wrangler@4.94.0 secret put GITHUB_TOKEN --config workers/crossclimb-publisher/wrangler.jsonc
npx wrangler@4.94.0 secret put PUBLISH_SECRET --config workers/crossclimb-publisher/wrangler.jsonc
```

5. Deploy the Worker:

```sh
npx wrangler@4.94.0 deploy --config workers/crossclimb-publisher/wrangler.jsonc
```

6. Open the extension options page and set:

- Publish endpoint: `https://crossclimb-log-publisher.<your-workers-subdomain>.workers.dev/publish`
- Publish secret: the same `PUBLISH_SECRET`
- Auto publish after save: enabled

## Test

Manual endpoint test:

```sh
curl -X POST "https://crossclimb-log-publisher.<your-workers-subdomain>.workers.dev/publish" \
  -H "Authorization: Bearer $PUBLISH_SECRET" \
  -H "Content-Type: application/json" \
  --data-binary @/path/to/linkedin-crossclimb-YYYY-MM-DD.json
```

Extension test:

1. Reload the unpacked extension in `chrome://extensions`.
2. Open the extension options page and save the publish settings.
3. Open a LinkedIn Crossclimb page.
4. Let the extension save a valid solved log, or use the popup's Publish Current Log button.
5. Watch GitHub Actions for `Publish Crossclimb Log`.

If the workflow commits new `data/*.json`, it deploys Cloudflare Pages in the same run.
