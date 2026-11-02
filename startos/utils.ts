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
