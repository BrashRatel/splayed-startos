import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { newRpcLogin } from '../utils'

/**
 * On a fresh install, use the Bitcoin node on this server if there already is one. Nothing is
 * switched on without a node (that would ask the user to install one), and a later install of
 * the node is picked up by the "Use the Bitcoin node" action. Updates and restores keep what the
 * user chose.
 */
export const seedNode = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return
  const installed = await effects.getInstalledPackages()
  if (!installed.includes('bitcoind')) return
  const store = await storeJson.read().once()
  const login = newRpcLogin()
  await storeJson.merge(effects, {
    useBitcoind: true,
    rpcUser: store?.rpcUser ?? login.rpcUser,
    rpcPassword: store?.rpcPassword ?? login.rpcPassword,
  })
})
