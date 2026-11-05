import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/** StartOS-side state. splayed's own settings live in its config.toml on the `main` volume. */
const shape = z.looseObject({
  /** Set by the "Use the Bitcoin node" action. */
  useBitcoind: z.boolean().catch(false),
  /**
   * The RPC user splayed registers on the node (through bitcoind's hidden
   * `generate-rpc-dependent` action). Made once, with a random suffix so a reinstall
   * doesn't collide with a user left behind on the node.
   */
  rpcUser: z.string().optional().catch(undefined),
  rpcPassword: z.string().optional().catch(undefined),
  /**
   * The `rpcUser` the "Create RPC Credentials" task was issued for. The task clears when the
   * user runs it, and dependency init runs again on every update, so without this it would come
   * back and fail with "user already exists".
   */
  rpcTaskUser: z.string().optional().catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: 'store.json' },
  shape,
)
