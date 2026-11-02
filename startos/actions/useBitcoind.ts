import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  enabled: Value.toggle({
    name: i18n('Use the Bitcoin node on this server'),
    description: i18n(
      'splayed works out whether the node follows BTC or XBT and uses it for that chain, in place of public servers. ECX and the other chain still go through Tor.',
    ),
    default: false,
  }),
})

export const useBitcoind = sdk.Action.withInput(
  'use-bitcoind',
  async () => ({
    name: i18n('Use the Bitcoin node'),
    description: i18n(
      'Read from and broadcast through your own Bitcoin Core or Knots node on this server.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  inputSpec,
  async () => ({
    enabled: (await storeJson.read((s) => s.useBitcoind).once()) ?? false,
  }),
  async ({ effects, input }) => {
    const store = await storeJson.read().once()
    // The login is made once and kept: the node keeps only its hash, so it can't be re-read.
    const rpcUser =
      store?.rpcUser ??
      `splayed_${utils.getDefaultString({ charset: 'a-z,0-9', len: 8 })}`
    const rpcPassword =
      store?.rpcPassword ??
      utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 32 })
    await storeJson.merge(effects, {
      useBitcoind: input.enabled,
      rpcUser,
      rpcPassword,
    })
    if (input.enabled) return null
    return {
      version: '1',
      title: i18n('Bitcoin node switched off'),
      message: i18n(
        'splayed keeps the node in its network settings. To stop using it, remove it in the web interface (Network: its address starts with http://10.0.3.1).',
      ),
      result: null,
    }
  },
)
