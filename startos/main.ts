import {
  rpcLocalHostId,
  rpcPortLocal,
} from 'bitcoin-core-startos/startos/utils'
import { socksHostId, socksPort } from 'tor-startos/startos/utils'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  allowedHosts,
  dataDir,
  rpcPasswordEnv,
  runAs,
  tokenFile,
  uiHostId,
  uiPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting splayed'))

  // Always passed (the Tor exception in the packaging guide): splayed stays fail-closed when
  // Tor isn't running, and works the moment it is.
  const torSocks = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'tor',
      hostId: socksHostId,
      internalPort: socksPort,
      fallbackPort: socksPort,
    })
    .const()

  const store = await storeJson
    .read((s) => ({
      use: s.useBitcoind,
      user: s.rpcUser ?? null,
      password: s.rpcPassword ?? null,
    }))
    .const(effects)
  const node =
    store?.use && store.user && store.password
      ? { user: store.user, password: store.password }
      : null

  // bitcoind's own RPC port, bridge-only (not the proxied `rpc` host). Absent when the node
  // isn't installed: then nothing is configured for it.
  const rpcAddress = node
    ? await sdk.host
        .getBridgeAddress(effects, {
          packageId: 'bitcoind',
          hostId: rpcLocalHostId,
          internalPort: rpcPortLocal,
        })
        .const()
    : null

  const hosts = await sdk.host
    .getOwn(
      effects,
      uiHostId,
      (host) => allowedHosts(host),
      (a, b) => a.join() === b.join(),
    )
    .const()

  const env: Record<string, string> = {
    SPLAYED_DATA_DIR: dataDir,
    SPLAYED_TOR_MODE: 'system',
    SPLAYED_TOR_SOCKS: torSocks ?? '',
    SPLAYED_UI_LISTEN: `0.0.0.0:${uiPort}`,
    SPLAYED_UI_TOKEN_FILE: tokenFile,
    SPLAYED_UI_ALLOWED_HOSTS: hosts.join(','),
  }
  // Also while the node is switched off: a node backend left in splayed's settings still names
  // this variable.
  if (store?.password) env[rpcPasswordEnv] = store.password

  const sub = await sdk.SubContainer.of(
    effects,
    { imageId: 'splayed' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: dataDir,
      readonly: false,
    }),
    'splayed',
  )

  // Each start, with the node switched on: find out which chain it follows (BTC or XBT, by
  // checkpoints and the BLAKE2b deployment) and add it there, replacing an earlier entry with the
  // same URL. A node that is still starting only logs a warning: the UI runs anyway, and the next
  // start tries again.
  const detectNode =
    node && rpcAddress
      ? [
          'splayed config backend detect --kind rpc',
          `--url http://${rpcAddress}`,
          `--user ${node.user} --password-env ${rpcPasswordEnv}`,
          '--proxy none --label "StartOS Bitcoin node" --add',
          '|| echo "splayed: could not check the Bitcoin node yet; it is tried again on the next start." >&2',
        ].join(' ')
      : 'true'

  return sdk.Daemons.of(effects)
    .addOneshot('chown', {
      subcontainer: sub,
      exec: {
        command: [
          'sh',
          '-c',
          `chown -R ${runAs}:${runAs} ${dataDir} && chmod 700 ${dataDir}`,
        ],
        user: 'root',
      },
      requires: [],
    })
    .addOneshot('token', {
      subcontainer: sub,
      exec: {
        // The first start makes the token; the Reset UI token action replaces it.
        command: [
          'sh',
          '-c',
          `[ -s ${tokenFile} ] || splayed ui --new-token-file ${tokenFile}`,
        ],
        env,
        user: runAs,
      },
      requires: ['chown'],
    })
    .addOneshot('detect-node', {
      subcontainer: sub,
      exec: { command: ['sh', '-c', detectNode], env, user: runAs },
      requires: ['token'],
    })
    .addDaemon('ui', {
      subcontainer: sub,
      exec: { command: ['splayed', 'ui'], env, user: runAs },
      ready: {
        display: i18n('Web interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          }),
      },
      requires: ['detect-node'],
    })
})
