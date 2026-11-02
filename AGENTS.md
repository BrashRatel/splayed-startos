# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

## This package

- The image is built from the `upstream-project/` submodule (splayed) with upstream's
  `docker/Dockerfile` and `WITH_TOR=0`. Clone with `--recurse-submodules`.
- splayed answers only the `Host` headers in `SPLAYED_UI_ALLOWED_HOSTS` and needs the token file
  at mode 0600, owned by `splayed`. `startos/main.ts` derives the hosts from the UI binding; if
  the Web UI returns 403 on a device, compare the browser's `Host` with that list first.
- Keyless: never add anything that asks for or stores a seed or private key. The UI does what the
  CLI does, nothing more.
- The bitcoind RPC login is made once and never rotated (the node keeps only a hash). Changing
  the user name or the task's `replayId` needs a migration that clears the old task.
- `npm install` needs `--ignore-scripts` where node-gyp can't download headers
  (bitcoin-core-startos pulls in `diskusage`, which this package doesn't use).
