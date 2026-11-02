import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiHostId, uiInterfaceId, uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const ui = sdk.MultiHost.of(effects, uiHostId)
  const origin = await ui.bindPort(uiPort, {
    protocol: 'http',
    preferredExternalPort: 80,
  })
  const iface = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: uiInterfaceId,
    description: i18n(
      'The splayed web interface. Sign in with the token from the Show UI token action.',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  return [await origin.export([iface])]
})
