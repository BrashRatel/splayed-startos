import { sdk } from './sdk'

// main: splayed's settings, public descriptors, plans and PSBTs (the token too). startos: the
// node login in store.json, which must match the user registered on the node.
export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('main', 'startos'),
)
