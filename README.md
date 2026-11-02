<p align="center">
  <img src="icon.svg" alt="splayed logo" width="21%">
</p>

# splayed on StartOS

> Everything not listed in this document should behave the same as upstream
> [splayed](https://github.com/BrashRatel/splayed). If a feature, setting, or behavior is not
> mentioned here, the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)

## Image and Container Runtime

The image is built from the `upstream-project/` submodule with upstream's `docker/Dockerfile`:
splayed is compiled with `deno compile` into one binary on Debian bookworm-slim. The build passes
`WITH_TOR=0`, so the image has no Tor of its own. Architectures: `x86_64` and `aarch64` (Deno has
no riscv64 build).

One subcontainer, `splayed`, runs as the image's unprivileged user `splayed` (uid 10001):

| Step          | Kind    | What it does                                                                    |
| ------------- | ------- | ------------------------------------------------------------------------------- |
| `chown`       | oneshot | As root: gives `/data` to `splayed`, mode 0700                                  |
| `token`       | oneshot | Makes the UI access token on the first start (`splayed ui --new-token-file`)    |
| `detect-node` | oneshot | With the node switched on: `splayed config backend detect --kind rpc ... --add` |
| `ui`          | daemon  | `splayed ui` in proxied mode, listening on `0.0.0.0:8080`                       |

`detect-node` never fails the start: a node that is still starting or syncing logs a warning, and
the next start tries again.

## Volume and Data Layout

| Volume    | Mount   | Contents                                                                                                                  |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| `main`    | `/data` | splayed's data directory (`SPLAYED_DATA_DIR`): `config.toml`, public descriptors, scan state, plans and PSBTs, `ui-token` |
| `startos` | —       | `store.json` (package state, below)                                                                                       |

## File Models

`store.json` on the `startos` volume, written only by the **Use the Bitcoin node** action:

- `useBitcoind`: whether the node is used.
- `rpcUser`, `rpcPassword`: the RPC login splayed registers on the node. Made once (32 random
  characters; the user name has a random suffix, so a reinstall doesn't collide with a user left on
  the node) and never rotated, because the node keeps only a hash.

splayed's own `config.toml` is upstream's and is edited through the Web UI or the CLI. The package
writes to it only through `config backend detect --add`, which adds the node to the chain it
follows and replaces an earlier entry with the same URL.

## Dependencies

- **Tor** (`tor`, required, running): splayed reaches public servers only through Tor, and there is
  no ECX node package, so Tor is needed even with a local node. Its SOCKS address is resolved from
  the Tor package's bridge-only `socks` binding (falling back to `10.0.3.1:9050`) and passed as
  `SPLAYED_TOR_MODE=system` and `SPLAYED_TOR_SOCKS`. splayed stays fail-closed: with Tor down,
  public backends fail; nothing falls back to clearnet. Tor's default `IsolateSOCKSAuth` keeps
  splayed's per-chain and per-broadcast circuits separate.
- **Bitcoin** (`bitcoind`, optional, any version and flavour): enabled by **Use the Bitcoin node**.
  splayed connects to bitcoind's own bridge-only `rpc-local` port (58332), not the proxied `rpc`
  port, with the login from `store.json` (password passed in `SPLAYED_BITCOIND_PASSWORD`, never
  stored in splayed's config). `txindex` is not required. A Knots RDTS node follows XBT;
  `config backend detect` finds that out from checkpoints and the BLAKE2b deployment.

## Network Access and Interfaces

| Interface | Port | Type | Notes                                                      |
| --------- | ---- | ---- | ---------------------------------------------------------- |
| Web UI    | 8080 | ui   | HTTP inside; StartOS adds HTTPS on the LAN and its domains |

splayed runs the UI in proxied mode: every API request needs the access token, wrong tokens are
throttled, and only known `Host` headers are answered (DNS-rebinding defence). The package sets
`SPLAYED_UI_ALLOWED_HOSTS` to the `host[:port]` of every non-local address of the UI binding, plus
`localhost:8080` and `127.0.0.1:8080`, and restarts splayed when those addresses change.

Outbound: public servers only through Tor; the node over the container bridge.

## Installation and First-Run Flow

1. On the first start the `token` oneshot creates `/data/ui-token` (mode 0600).
2. The user reads it with **Show UI token** and signs in on the Web UI.
3. splayed's own setup guide follows (network review, wallet import, scan, plan). Nothing about the
   user's coins is sent anywhere before they confirm the network settings.

The camera (QR import) works only over HTTPS, so the HTTPS LAN address or a domain is needed for it.

## Actions

| Action               | Visibility | Status       | Effect                                                                                                                                 |
| -------------------- | ---------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Show UI token        | enabled    | any          | Returns the token (masked, copyable)                                                                                                   |
| Reset UI token       | enabled    | running only | Writes a new token, returns it, restarts splayed; open tabs must sign in again                                                         |
| Use the Bitcoin node | enabled    | any          | Toggles `useBitcoind`; makes the RPC login the first time. Switching off leaves the node in splayed's settings (removed in the Web UI) |

## Tasks

- **Create RPC credentials** on `bitcoind` (critical), raised when the node is switched on. It runs
  bitcoind's hidden `generate-rpc-dependent` action with splayed's user name and password
  pre-filled, which adds an `rpcauth` entry. It has no `when` condition, so it clears once run.

## Health Checks

| Check         | Probes                 | Failure means                                                   |
| ------------- | ---------------------- | --------------------------------------------------------------- |
| Web interface | port 8080 is listening | `splayed ui` didn't start: read the logs (token file, settings) |

The check doesn't make an HTTP request, because splayed answers only its allowed host names.

## Backups and Restore

Both volumes are backed up: `main` (settings, descriptors, scan state, plans, PSBTs and the token)
and `startos` (the node login, which has to match the user registered on the node). After a restore
the same token and node login work.

## Limitations and Differences

- No managed Tor: the image has no Tor, and splayed uses the Tor service.
- Only one Bitcoin node (StartOS runs one `bitcoind` flavour at a time), so a local node covers BTC
  or XBT, not both. The other chain and ECX use public servers over Tor.
- The CLI isn't exposed; everything is done in the Web UI, which does everything the CLI does that
  the route needs.

---

## Quick Reference for AI Consumers

```yaml
package_id: 'splayed'
image: 'dockerBuild upstream-project/docker/Dockerfile (WITH_TOR=0)'
architectures: [x86_64, aarch64]
subcontainers: [splayed]
volumes: { main: /data, startos: store.json }
file_models: [store.json]
startos_managed_env_vars:
  [
    SPLAYED_DATA_DIR,
    SPLAYED_TOR_MODE,
    SPLAYED_TOR_SOCKS,
    SPLAYED_UI_LISTEN,
    SPLAYED_UI_TOKEN_FILE,
    SPLAYED_UI_ALLOWED_HOSTS,
    SPLAYED_BITCOIND_PASSWORD,
  ]
dependencies: [tor (required), bitcoind (optional)]
interfaces: { ui: 8080 }
actions: [show-ui-token, reset-ui-token, use-bitcoind]
tasks: [bitcoind generate-rpc-dependent]
health_checks: [ui]
```
