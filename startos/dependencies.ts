import { generateRpcUserDependent } from 'bitcoin-core-startos/startos/actions/generateRpcUserDependent'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'

// Public ECX, XBT and BTC servers are reached through Tor only; there is no ECX package, so
// Tor is needed even with a local Bitcoin node.
const tor = sdk.Dependency.required('tor', {
  description: i18n(
    'Reaches public ECX, XBT and BTC servers without revealing your IP address',
  ),
  metadata: {
    title: 'Tor',
    icon: 'https://raw.githubusercontent.com/Start9Labs/tor-startos/master/icon.svg',
  },
  versionRange: '*',
  kind: 'running',
  healthChecks: ['tor'],
})

// Core or Knots (any flavour): `config backend detect` finds out whether the node follows BTC
// or XBT, so any version will do. txindex is not required.
const bitcoind = sdk.Dependency.optional('bitcoind', {
  description: i18n(
    'Optional: your own node for BTC or XBT, in place of public servers',
  ),
  metadata: {
    title: 'Bitcoin',
    icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/31.x/icon.svg',
  },
  versionRange: '*',
  kind: 'running',
  healthChecks: ['bitcoind'],
  enabled: async ({ effects }) =>
    (await storeJson.read((s) => s.useBitcoind).const(effects)) === true,
}).withInit(async (effects) => {
  const creds = await storeJson
    .read((s) =>
      s.rpcUser && s.rpcPassword
        ? { user: s.rpcUser, password: s.rpcPassword }
        : null,
    )
    .const(effects)
  if (!creds) return
  // The action only adds a user (it refuses an existing name), so it is run once: a task
  // without a `when` condition clears when the user runs it.
  await sdk.action.createTask(
    effects,
    'bitcoind',
    generateRpcUserDependent,
    'critical',
    {
      input: {
        kind: 'partial',
        accept: [{ username: creds.user, password: creds.password }],
        set: { username: creds.user, password: creds.password },
      },
      reason: i18n('Create the RPC login splayed uses to read from your node'),
      replayId: `splayed-rpc-user-${creds.user}`,
    },
  )
})

export const dependencies = sdk.Dependencies.of()
  .addDependency(tor)
  .addDependency(bitcoind)
