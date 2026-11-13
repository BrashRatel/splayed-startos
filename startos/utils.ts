import { utils } from '@start9labs/start-sdk'
import type { T } from '@start9labs/start-sdk'

/** The port the splayed web UI listens on inside the container (as in upstream's Docker image). */
export const uiPort = 8080
export const uiHostId = 'ui'
export const uiInterfaceId = 'ui'

/** splayed's data directory (SPLAYED_DATA_DIR) inside the subcontainer. */
export const dataDir = '/data'
/** The UI access token, relative to the `main` volume. splayed requires mode 0600. */
export const tokenSubpath = 'ui-token'
export const tokenFile = `${dataDir}/${tokenSubpath}`

/** The image's unprivileged user (uid 10001), which owns /data. */
export const runAs = 'splayed'

/** The env var the node backend's password is read from (splayed never stores it in its config). */
export const rpcPasswordEnv = 'SPLAYED_BITCOIND_PASSWORD'

/**
 * Variables a server password must not be stored under: splayed's own settings (`SPLAYED_*`,
 * which the package sets itself) and the ones the container's shell and programs rely on.
 */
const reservedEnv = new Set([
  'HOME',
  'HOSTNAME',
  'LANG',
  'LANGUAGE',
  'LOGNAME',
  'PATH',
  'PWD',
  'SHELL',
  'TERM',
  'TMPDIR',
  'TZ',
  'USER',
])

/** The input pattern for a password variable's name (checked again by `serverPasswordEnv`). */
export const envNamePattern = '^[A-Z][A-Z0-9_]*$'

/**
 * Whether `name` may carry a password from the Server passwords action: an upper-case shell
 * variable name that isn't reserved, so a stored password can never replace one of splayed's
 * settings or the container's own environment.
 */
export function isServerPasswordEnv(name: string): boolean {
  return (
    new RegExp(envNamePattern).test(name) &&
    !name.startsWith('SPLAYED_') &&
    !name.startsWith('LC_') &&
    !name.startsWith('LD_') &&
    !reservedEnv.has(name)
  )
}

/**
 * The Host headers the UI may answer, one per address of the UI binding: `name[:port]`, as a
 * browser sends it (the default port of the scheme is left out). splayed refuses any other Host
 * (DNS-rebinding defence), so this has to follow the addresses the user adds and removes.
 * Loopback is always allowed, for checks from inside the container.
 */
export function allowedHosts(host: T.Host | null): string[] {
  const hosts = new Set([`127.0.0.1:${uiPort}`, `localhost:${uiPort}`])
  if (host) {
    const filled = utils.filledAddress(host, {
      hostId: uiHostId,
      internalPort: uiPort,
      username: null,
      scheme: 'http',
      sslScheme: 'https',
      suffix: '',
    })
    for (const url of filled.nonLocal.format('url'))
      hosts.add(url.host.toLowerCase())
  }
  return [...hosts].sort()
}

/**
 * The RPC login splayed registers on the node: made once and kept (the node keeps only a hash of
 * the password, so it can't be read back). The random suffix keeps a reinstall from colliding
 * with a user left behind on the node.
 */
export function newRpcLogin(): { rpcUser: string; rpcPassword: string } {
  return {
    rpcUser: `splayed_${utils.getDefaultString({ charset: 'a-z,0-9', len: 8 })}`,
    rpcPassword: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 32 }),
  }
}
