import { sdk } from '../sdk'
import { resetUiToken, showUiToken } from './uiToken'
import { useBitcoind } from './useBitcoind'

export const actions = sdk.Actions.of()
  .addAction(showUiToken)
  .addAction(resetUiToken)
  .addAction(useBitcoind)
