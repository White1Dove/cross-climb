# Puzzle Clues Today

[Puzzle Clues Today](https://puzzleclues.today/) is an unofficial daily answer site for LinkedIn Games puzzles.

Current coverage:

- [Crossclimb Today](https://puzzleclues.today/) with clues, hints, word ladders, answer history, and clue-by-clue reasoning when source clues are available.
- [Pinpoint Today](https://puzzleclues.today/pinpoint/) with clue lists, category answers, answer history, and short answer analysis.

## Project Notes

The site is built with Next.js and exported as static pages for Cloudflare Pages. Daily puzzle data is stored in `data/` and updated by the publishing workflow.

Useful commands:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Content Policy

Historical answer pages only show clue reasoning when real clue data is available from the captured puzzle payload. Missing clues are not generated or inferred.

Puzzle Clues Today is not affiliated with, endorsed by, or sponsored by LinkedIn Corporation. LinkedIn is a registered trademark of LinkedIn Corporation.
